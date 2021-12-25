import "mocha"
import { expect } from "chai"
import {
  compile,
  CompilerError,
} from "../index"

import {
  TEST_CASES,
} from "../predefined"

describe("compile", () => {
  it("should compile csfs", () => {
    const contractSource = TEST_CASES["HodlVault"]
    const compiled = compile(contractSource)
    expect((compiled as CompilerError).message).to.equal(undefined) // so it prints the error
    console.log(compiled)
  })
});