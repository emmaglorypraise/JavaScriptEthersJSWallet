import abi from "./abi.js";
import openCity from "./tab.js";
const { ethers: etherjs } = ethers;
import tokenList from "./tokenList.js";

const rpcUrl = "https://eth-goerli.g.alchemy.com/v2/FVhKzRogIAlI_zgqGdtgyVzZYTL9_yct";

const providerSigner = new etherjs.providers.Web3Provider(window.ethereum);

const signer = providerSigner.getSigner();

const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);

const tokenAddress = tokenList.tokens[0].address;

let connectedWallet;

const connectWallet = async () => {
  await providerSigner.send("eth_requestAccounts");
  await getUserWallet();
};

const getUserWallet = async () => {
  let userAddress = await signer.getAddress();
  connectedWallet = userAddress;
  userAdd.innerText = connectedWallet;
  return userAddress
};


const tokenContract = (address = tokenAddress, contractAbi = abi, isSigner = false) => {
  const newProvider = isSigner ? signer : provider;
  return new ethers.Contract(address, contractAbi, newProvider);
};

const button = document.getElementById("connectBtn");
const userAdd = document.getElementById("userAdd");
button.addEventListener("click", connectWallet);

let currentTokenData = {
  name: tokenList.tokens[0].name,
  symbol: tokenList.tokens[0].symbol,
  address: tokenList.tokens[0].address
}

activeTokenName.innerText = currentTokenData.name;
activeTokenSymbol.innerText = currentTokenData.symbol;

function getCurrentAddress(name, symbol, address) {
  currentTokenData.name = name;
  currentTokenData.symbol = symbol;
  currentTokenData.address = address;
  activeTokenName.innerText = currentTokenData.name;
  activeTokenSymbol.innerText = currentTokenData.symbol;
  openCity(event, 'Paris');
}


// -------------------- CREATE TOKEN TEMPLATE  -----------------------------

function tokenTemplate(value) {
  const { name, symbol, totalSupply, balance, address } = value;
  return `
      <div class="flex justify-between items-center mb-5 border-b-2 border-blue-500 py-2" onclick="getCurrentAddress('${name}', '${symbol}', '${address}')">
      <div>
          <div class="flex items-center">
              <div class="p-2 token-thumbnail w-10 h-10"> 
                  <img src="https://bafybeiekvvr4iu4bqxm6de5tzxa3yfwqptmsg3ixpjr4edk5rkp3ddadaq.ipfs.dweb.link/" alt="token-img" />  </div>
              <div>
                  <p class="font-semibold">${name} - ${symbol}</p>
                  <p>Total Supply: ${totalSupply}</p>
              </div>
          </div>
      </div>
      <div>Your token balance: ${balance}</div>
    </div>

  `
}



async function initData() {
  let list = tokenList.tokens;
  for (let token of list) {
    tokenDetails(token.address);
  }
}
initData();


async function tokenDetails(address) {
  await connectWallet();
  loader.innerText = "Loading";
  const token = tokenContract(address, abi);
  try {
    const [name, symbol, totalSupply, balance, decimals] = await Promise.all([
      token.name(),
      token.symbol(),
      token.totalSupply(),
      token.balanceOf(connectedWallet),
      token.decimals()
    ]);
    const newDecimal = Number(decimals);
    const template = tokenTemplate({ name, symbol, totalSupply: totalSupply / 10 ** newDecimal, balance: balance / 10 ** newDecimal, address });
    tokenHolder.innerHTML += template;
  } catch (error) {
    errored.innerText = "Error occured!";
    console.log("error occured", error);
  } finally {
    loader.innerText = "";
  }
}

// -------------------- SEND TOKEN -----------------------------

async function sendToken(address, amount) {
  const contract = await tokenContract(currentTokenData.address, abi, true);
  console.log(contract, "token contract");
  const decimal = await contract.decimals();
  const newDecimal = Number(decimal);
  console.log(newDecimal, "decimals");
  const parseAmount = new etherjs.utils.parseUnits(amount, newDecimal);
  const txn = await contract.transfer(address, parseAmount);
  console.log(txn, "transaction pending....");
  sendBtn.innerText = "Sending";
  sendBtn.disabled = true;
  window.alert("transaction pending...");
  const confirm = txn.wait();
  console.log(confirm, "transaction ends");
  window.alert(`Success!!! ${amount} ${currentTokenData.symbol} sent to ${address}`);
  sendBtn.innerText = "Sent";
}


sendBtn.addEventListener("click", async () => {
  const amountReceived = amount.value;
  const receiverAddress = receiver.value;
  console.log(amountReceived, receiverAddress);
  await sendToken(receiver.value, amount.value);
})


export default {
  openCity,
};

window.getCurrentAddress = getCurrentAddress;