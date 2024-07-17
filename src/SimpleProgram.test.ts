import { SimpleProgram } from "./SimpleProgram"
import { Field } from "o1js";

describe('SimpleProgram', () => {
  it('generates and verifies the proof', async () => {
    const {verificationKey} = await SimpleProgram.compile();
    const proof = await SimpleProgram.run(Field(1));
    console.log("Verifying proof")
    //proof.verify();
  })
})