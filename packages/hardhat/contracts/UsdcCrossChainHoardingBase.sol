// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
//CCIP imports
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
//Hoarding Contract imports
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title - A Hoarding contract for transferring Circle's USDC tokens from Base Sepolia to Ethereum Sepolia to any EOA address.
/// @author - @moneyhoardermike
/* This contract can tranfer Hoarders USDC tokens to Ethereum Sepolia 
after hoarder approves contract to transfer USDC tokens.
Hoarders will be able to easily tranfer & hoard their USDC tokens across supported networks
 and earn rewards for hoarding USDC tokens. */
contract UsdcCrossChainHoardingBase is  ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Hoarder {
        uint256 hoarded;
        uint256 timeHoarded;
        bool isHoarding;
        uint256 Total_AllTime_Hoarded;
        uint256 reward;
        uint256 Total_AllTime_Reward;
    }

    mapping (address => Hoarder) public hoarders;
    uint256 timeHoarded;
    uint256 public totalHoarded = 0;
    uint256 public Total_Hoarders = 0;
    uint256 public Total_Reward_Pool;

    event Hoarded(address indexed user, uint256 amount);
    event Pooled(address indexed user, uint256 amount);
    event UnHoarded(address indexed user);

    


    // Custom errors to provide more descriptive revert messages.
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance to cover the fees.
    error NotEnoughBalanceForFees(uint256 currentBalance, uint256 calculatedFees);

    error NotEnoughBalanceUsdcForTransfer(uint256 currentBalance);
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.
    error InvalidReceiverAddress(); // Used when the receiver address is 0.

    // Event emitted when the tokens are transferred to an account on another chain.
    event TokensTransferred(
        bytes32 indexed messageId, // The unique ID of the message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        address token, // The token address that was transferred.
        uint256 tokenAmount, // The token amount that was transferred.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the message.
    );

    // Mapping to keep track of allowlisted destination chains.
    mapping(uint64 => bool) public allowlistedChains;
     address public owner;
    IRouterClient private ccipRouter;

    IERC20 private immutable linkToken;
    IERC20 private immutable usdcToken;
    

    // https://developers.circle.com/stablecoins/docs/usdc-on-test-networks
    address usdcAddress = 0x036CbD53842c5426634e7929541eC2318f3dCF7e; // USDC on Base Sepolia

    // https://docs.chain.link/ccip/supported-networks/v1_2_0/testnet#ethereum-sepolia
    uint64 _destinationChainSelector = 16015286601757825753; // Sepolia

    event UsdcTransferred(
        bytes32 messageId,
        uint64 _destinationChainSelector,
        address receiver,
        uint256 amount,
        uint256 ccipFee
    );

    /// @notice Constructor initializes the contract with the router address.
    /// @param b_router The address of the router contract.
    /// @param b_link The address of the link contract.
    constructor(address b_router, address b_link) {
        owner = msg.sender;
        ccipRouter = IRouterClient(b_router);
        linkToken = IERC20(b_link);
        usdcToken = IERC20(usdcAddress);  // USDC address Base Sepolia
    }

    /// @dev Modifier that checks if the chain with the given destinationChainSelector is allowlisted.
    /// @param _destinationChainSelector The selector of the destination chain.
    modifier onlyAllowlistedChain(uint64 _destinationChainSelector) {
        if (!allowlistedChains[_destinationChainSelector])
            revert DestinationChainNotAllowlisted(_destinationChainSelector);
        _;
    }

    /// @dev Modifier that checks the receiver address is not 0.
    /// @param _receiver The receiver address.
    modifier validateReceiver(address _receiver) {
        if (_receiver == address(0)) revert InvalidReceiverAddress();
        _;
    }

    /// @dev Updates the allowlist status of a destination chain for transactions.
    /// @notice This function can only be called by the owner.
    /// @param _destinationChainSelector The selector of the destination chain to be updated.
    /// @param allowed The allowlist status to be set for the destination chain.
    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedChains[_destinationChainSelector] = allowed;
    }

     function transferUsdcToSepolia(
        address _receiver,
        uint256 _amount
    )
        external
        returns (bytes32 messageId)
    {
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: address(usdcToken),
            amount: _amount
        });
        tokenAmounts[0] = tokenAmount;

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: "",
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 0})
            ),
            feeToken: address(linkToken)
        });

        uint256 ccipFee = ccipRouter.getFee(
            _destinationChainSelector,
            message
        );

        if (ccipFee > linkToken.balanceOf(address(this)))
            revert NotEnoughBalanceForFees(linkToken.balanceOf(address(this)), ccipFee);
        linkToken.approve(address(ccipRouter), ccipFee);

        if (_amount > usdcToken.balanceOf(msg.sender))
            revert NotEnoughBalanceUsdcForTransfer(usdcToken.balanceOf(msg.sender));
        usdcToken.safeTransferFrom(msg.sender, address(this), _amount);
        usdcToken.approve(address(ccipRouter), _amount);

        // Send CCIP Message
        messageId = ccipRouter.ccipSend(_destinationChainSelector, message);

        emit UsdcTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _amount,
            ccipFee
        );
    }


    function allowanceUsdc(address account) public view returns (uint256 usdcAmount) {
        usdcAmount = usdcToken.allowance(account, address(this));
    }

    function balancesOf(address account) public view returns (uint256 linkBalance, uint256 usdcBalance) {
        linkBalance =  linkToken.balanceOf(account);
        usdcBalance = IERC20(usdcToken).balanceOf(account);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));
        if (amount == 0) revert NothingToWithdraw();
        IERC20(_token).transfer(_beneficiary, amount);
    }

/*Hoarding Contracts Functions*/ 
    //Function to hoard tokens.
    function Hoard(uint256 _amount) external nonReentrant {
        require(!hoarders[msg.sender].isHoarding, "Hoarder already exist");
        require(usdcToken.balanceOf(msg.sender) >= 0, "You cannot hoard more tokens than you hold and hoarding is Non-ReEntry");
        usdcToken.transferFrom(msg.sender, address(this), _amount);
        hoarders[msg.sender].hoarded += _amount;
        hoarders[msg.sender].timeHoarded = block.timestamp;
        hoarders[msg.sender].isHoarding = true;
        hoarders[msg.sender].Total_AllTime_Hoarded += _amount;
        totalHoarded += _amount;
        Total_Hoarders += 1;
        emit Hoarded(msg.sender, _amount);
    }
    //Function to allow hoarders to increase their hoard.
    function IncreaseHoard(uint256 _amount) public  {
        require(usdcToken.balanceOf(msg.sender) >= 0, "You cannot hoard more tokens than you hold");
        usdcToken.transferFrom(msg.sender, address(this), _amount);
        hoarders[msg.sender].hoarded += _amount;
        hoarders[msg.sender].isHoarding = true;
        hoarders[msg.sender].Total_AllTime_Hoarded += _amount;
        totalHoarded += _amount;
        emit Hoarded(msg.sender, _amount);
    }
    //Function to calculate reward for current hoard.
    function calculateReward(address _hoarder) public view returns (uint256) {
        uint256 hoardingTime = block.timestamp - hoarders[_hoarder].timeHoarded;
        uint256 annualReward = (hoarders[_hoarder].hoarded * 6) / 100;
        uint256 reward = (annualReward * hoardingTime) / 31536000;  // 365 days in seconds
        return reward;
    }
    //Function to withdraw hoard and claim rewards
    function ClaimReward() public {
        require(hoarders[msg.sender].isHoarding == true, "You cannot unhoard if you are not hoarding");
        require(block.timestamp >= hoarders[msg.sender].timeHoarded + 6 days, "You cannot Claim in the first 6 days of hoarding following the project 6 model");
        usdcToken.transfer(msg.sender, hoarders[msg.sender].hoarded);
        totalHoarded -= hoarders[msg.sender].hoarded;
        uint256 reward = calculateReward(msg.sender);
        require(usdcToken.balanceOf(address(this)) >= reward, "The contract does not have enough tokens to give you the reward");
        usdcToken.transfer(msg.sender, reward);
        hoarders[msg.sender].Total_AllTime_Reward += reward;
        hoarders[msg.sender].reward += reward;
        hoarders[msg.sender].hoarded = 0;
        hoarders[msg.sender].timeHoarded = 0;
        hoarders[msg.sender].isHoarding = false;
        Total_Hoarders -= 1;
        Total_Reward_Pool -= reward;
    }
    //Function to withdraw hoard and claim rewards
    function Unhoard() public {
        require(hoarders[msg.sender].isHoarding == true, "You cannot unhoard if you are not hoarding");
        require(block.timestamp >= hoarders[msg.sender].timeHoarded + 6 minutes, "You cannot unhoard in the first 6 minutes of hoardinging following the project 6 model");
        usdcToken.transfer(msg.sender, hoarders[msg.sender].hoarded);
        totalHoarded -= hoarders[msg.sender].hoarded;
        uint256 reward = calculateReward(msg.sender);
        require(usdcToken.balanceOf(address(this)) >= reward, "The contract does not have enough tokens to give you the reward");
        usdcToken.transfer(msg.sender, reward);
        hoarders[msg.sender].Total_AllTime_Reward += reward;
        hoarders[msg.sender].reward += reward;
        hoarders[msg.sender].hoarded = 0;
        hoarders[msg.sender].timeHoarded = 0;
        hoarders[msg.sender].isHoarding = false;
        Total_Hoarders -= 1;
        Total_Reward_Pool -= reward;
    }
    //Read only function that checks the hoarders hoarding time in seconds.
    function GetHoardingingTimeInSeconds(address _hoarder) public view returns (uint256) {
        return block.timestamp - hoarders[_hoarder].timeHoarded;
    }
    //Read only function that checks the users non-hoarding balance.
    function CheckUsdcBalance(address _owner) public view returns (uint256) {
        return usdcToken.balanceOf(_owner);
    }
        //Read only function that checks the users hoarding balance.
    function Check_Usdc_Hoarded_Balance(address _owner) public view returns (uint256) {
        return hoarders[_owner].hoarded;
    }
    //Transfers tokens to the hoarding rewards pool as a donation the tokens can't be withdrawn!
    function DonationPool(uint256 _amount) public  {
        require(usdcToken.balanceOf(msg.sender) >= 0, "You cannot pool more tokens than you hold");
        usdcToken.transferFrom(msg.sender, address(this), _amount);
        Total_Reward_Pool += _amount;
        emit Pooled(msg.sender, _amount);
    }
}
