import { Field, ZkProgram } from "o1js";

export const SimpleProgram = ZkProgram({
  name: 'zk_program_july_17',
  publicInput: Field,
  publicOutput: Field,
  methods: {
    run: {
      privateInputs: [],
      async method(publicInput: Field) {
        publicInput.assertEquals(Field(0))
        return publicInput
      }
    }
  }
})

export class SimpleProgramProof extends ZkProgram.Proof(SimpleProgram) {}