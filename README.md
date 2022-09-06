# Simple wallet that allows you view your token and transfer to other

## Steps

- Use the provider to display token details

- Determine to use provider or signer, for readonly provider

- Contract Instance takes in - contract address, abi, provider or signer

- To view contract details - ContractInstance.FunctionName(args)



For example:
```
function nameOfOwner() public view returns(address) {return ownerAddress}

const nameOfOwner = await ContractInstance.nameOfOwner()

```

## UI Updates
- set the tokenTemplate as function to receive dynamic data - tokenTemplate
- create a function to get the data from the blockchain - tokenDetails
- create a global init function to set the result of tokenDetailsfunction to tokenTemplate
- set innerHTML of tokenDetailss inside html file to the result of tokenTemplate

## Send Token To another Wallet
- Connect to metamask - with connectWallet() function
- Call the sendToken Function this instantiate the contract interface wit the signer
   - get the decimals of the token by calling getDecimals function
   - Convert the amt to be send to a bigNumber format - with new etherjs.utils.parseUnits(amt, decimal)
   - Send the send transaction with the transfer method - contract.transfer(address, parseUnit)
   - Wait for the transaction to mine with the .wait() on the last async operation
- Update the ui accordingly.
<!-- 
UI should show list of tokens, with send, buy and swap button on 
on sending, show modal and blur background, loader should work while waiting for transaction to send, 
or toto tokens page
on home page, there should be a button to add a token to token lists with a return home button with token address, symbol, decimal, pictures, 
you can also create a new addresses

ERC20 Token generator:
User should be able to token name, symbol, image, decimals, type of coin and address to mint to
 another page, with all details of particular token, show transaction done, and a button to go back  -->