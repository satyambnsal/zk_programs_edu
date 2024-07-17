import { AccountUpdate, Field, Mina, PrivateKey, PublicKey } from 'o1js';
import { Add } from './Add';
import { SimpleProgram } from './SimpleProgram';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = true;

describe('Add', () => {
  let deployerAccount: Mina.TestPublicKey,
    deployerKey: PrivateKey,
    senderAccount: Mina.TestPublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Add;

  beforeAll(async () => {
    if (proofsEnabled) {
      await SimpleProgram.compile()
      await Add.compile()
    };
  });

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    [deployerAccount, senderAccount] = Local.testAccounts;
    deployerKey = deployerAccount.key;
    senderKey = senderAccount.key;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Add(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it.skip('generates and deploys the `Add` smart contract', async () => {
    await localDeploy();
    const num = zkApp.num.get();
    expect(num).toEqual(Field(1));
  });

  it.skip('correctly updates the num state on the `Add` smart contract', async () => {
    await localDeploy();

    // update transaction
    const txn = await Mina.transaction(senderAccount, async () => {
      await zkApp.update();
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const updatedNum = zkApp.num.get();
    expect(updatedNum).toEqual(Field(3));
  });

  it('correctly verifies simple program proof', async () => {
    await localDeploy();

    // const {verificationKey} = await SimpleProgram.compile();
    const proof = await SimpleProgram.run(Field(0));
    
    const txn = await Mina.transaction(senderAccount, async () => {
      await zkApp.verify_simple_program_proof(proof)
    })
    await txn.prove();

    await txn.sign([senderKey]).send();

    const updatedNum = zkApp.num.get();
    expect(updatedNum).toEqual(Field(0));
  })

});
