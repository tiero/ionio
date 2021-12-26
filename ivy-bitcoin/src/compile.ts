import { optimize } from "./btc/optimize"
import { toContractParameter } from "./btc/parameters"
import toOpcodes from "./btc/toOpcodes"
import { desugarContract } from "./desugar"
import { compileContractToIntermediate, FinalOperation, InstructionOp } from "./intermediate"
import { referenceCheck } from "./references"
import { compileStackOps } from "./stack"
import { CompilerError, Template, toTemplateClause } from "./template"
import { typeCheckContract } from "./typeCheck"

import { RawContract } from "./ast"
import { numberToHex } from "./cast"

const parser = require("../lib/parser");

export function compile(source: string): Template | CompilerError {
  try {
    const rawAst = parser.parse(source) as RawContract
    const referenceChecked = referenceCheck(rawAst)
    const ast = typeCheckContract(referenceChecked)
    const templateClauses = ast.clauses.map(toTemplateClause)
    const operations = compileStackOps(
      compileContractToIntermediate(desugarContract(ast))
    )
    
    // TODO: move in a dedicate casting file
    // bytes: cast int to hex string
    operations.forEach((finalOp: FinalOperation, index: number) => {
      const previousIndex = index - 1;
      // checks for casting of bytes(Integer) at main level
      if (finalOp.type === "instructionOp" && finalOp.expression.instruction === "bytes") {
        const previousOp = operations[previousIndex];
        if (previousOp.type === "push" && previousOp.literalType === "Integer") {
          operations[previousIndex] = {
            ...previousOp,
            literalType: "Bytes",
            value: numberToHex(Number(previousOp.value))
          };
        }
      }
    });



    const instructions = optimize(toOpcodes(operations))
    const params = ast.parameters.map(toContractParameter)
    return {
      type: "template",
      name: ast.name,
      instructions,
      clauses: templateClauses,
      clauseNames: templateClauses.map(clause => clause.name),
      params,
      source
    }
  } catch (e) {
    // catch and return CompilerError
    let errorMessage: string
    if (e.location !== undefined) {
      const start = e.location.start
      const name = e.name === "IvyTypeError" ? "TypeError" : e.name
      errorMessage =
        name +
        " at line " +
        start.line +
        ", column " +
        start.column +
        ": " +
        e.message
    } else {
      errorMessage = e.toString()
    }
    return {
      type: "compilerError",
      source,
      message: errorMessage
    }
  }
}
