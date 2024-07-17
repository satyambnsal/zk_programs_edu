import { Field, ZkProgram } from "o1js";

export const SimpleProgram = ZkProgram({
  name: 'zk_program_july_17',
  publicInput: Field,
  methods: {
    run: {
      privateInputs: [],
      async method(publicInput: Field) {
        publicInput.assertEquals(Field(0))
      }
    }
  }
})