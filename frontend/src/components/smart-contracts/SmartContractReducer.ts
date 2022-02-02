import { ethers, constants } from 'ethers';
import { ERC20, ERC20__factory, Job, Job__factory } from 'contracts-typechain';
export interface SmartContractState {
  connected: boolean;
  isERC20Approved: boolean;
  currentTxId: string | undefined;
  currentTxState: string | undefined;
  approvingERC20: boolean;
  revokingERC20: boolean;
  Job: Job;
  ERC20: ERC20;
}

export const initialSmartContractsState: SmartContractState = {
  connected: false,
  approvingERC20: false,
  revokingERC20: false,
  isERC20Approved: false,
  currentTxId: undefined,
  currentTxState: undefined,
  ERC20: ERC20__factory.connect(
    process.env.REACT_APP_PAYMENT_TOKEN_CONTRACT_ADDRESS ?? '',
    new ethers.providers.JsonRpcProvider()
  ),
  Job: Job__factory.connect(
    process.env.REACT_APP_JOB_CONTRACT_ADDRESS ?? '',
    new ethers.providers.JsonRpcProvider()
  ),
};

export const SmartContractActions = {
  ATTACH_WALLET: 'ATTACH_WALLET',
  DETACH_WALLET: 'DETACH_WALLET',
  UPDATE_TRANSACTION_STATE: 'UPDATE_TRANSACTION_STATE',
  REVOKE_ERC20: 'REVOKE_ERC20',
  UPDATE_ERC20_APPROVAL: 'UPDATE_ERC20_APPROVAL',
};

export type SmartContractAction = {
  type: string;
  payload: any;
};

export const smartContractReducer = (
  state: SmartContractState,
  action: SmartContractAction
): SmartContractState => {
  switch (action.type) {
    case SmartContractActions.ATTACH_WALLET: {
      const wallet = action.payload.wallet;

      if (wallet.provider !== null) {
        state = {
          ...state,
          ERC20: ERC20__factory.connect(
            process.env.REACT_APP_PAYMENT_TOKEN_CONTRACT_ADDRESS ?? '',
            wallet.provider.getSigner()
          ),
          Job: Job__factory.connect(
            process.env.REACT_APP_JOB_CONTRACT_ADDRESS ?? '',
            wallet.provider.getSigner()
          ),
        };
      }

      return state;
    }
    case SmartContractActions.UPDATE_TRANSACTION_STATE: {
      return {
        ...state,
        currentTxState: action.payload.txTypeState,
        currentTxId: action.payload.txTypeId,
      };
    }
    case SmartContractActions.REVOKE_ERC20: {
      state = {
        ...state,
        revokingERC20: true,
      };

      try {
        state.ERC20 &&
          state.ERC20.approve(
            process.env.REACT_APP_JOB_CONTRACT_ADDRESS ?? '',
            0
          );
      } catch (e: any) {
        // catch error
      }
      return state;
    }
    case SmartContractActions.UPDATE_ERC20_APPROVAL: {
      state = {
        ...state,
        isERC20Approved: action.payload.approved,
        approvingERC20: false,
        revokingERC20: false,
      };
      return state;
    }
    default: {
      return state;
    }
  }
};
