import { instantiate } from ".."
import { compile } from "../compile"
import { TEST_CASES, TEST_CONTRACT_ARGS } from "../predefined"
import {  Template } from "../template"

describe("compile", () => {
    it("should compile hodlvault", () => {
      const id = "HodlVault"
      const contractSource = TEST_CASES[id]
      const compiled = compile(contractSource)
      const instantiated = instantiate(compiled as Template, TEST_CONTRACT_ARGS[id]);
      console.log(instantiated.template.instructions);
    })
    it("should compile hello world spend", () => {
      const id = "HelloWorldSpend"
      const contractSource = TEST_CASES[id]
      const compiled = compile(contractSource)
      const instantiated = instantiate(compiled as Template, TEST_CONTRACT_ARGS[id]);
      console.log(instantiated.template.instructions);
    })
})
