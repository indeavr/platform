import { ethers } from 'ethers';
import { ERC20, ERC20__factory, Job, Job__factory } from 'contracts-typechain';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';

export interface SmartContractState {
  connected: boolean;
  isERC20Approved: boolean;
  currentTxId: string | undefined;
  currentTxState: string | undefined;
  Job: Job;
  ERC20: ERC20;
}

export const initialSmartContractsState: SmartContractState = {
  connected: false,
  isERC20Approved: false,
  currentTxId: undefined,
  currentTxState: undefined,
  ERC20: ERC20__factory.connect(
    SmartContractAddresses.PaymentToken,
    new ethers.providers.BaseProvider('any')
  ),
  Job: Job__factory.connect(
    SmartContractAddresses.Job,
    new ethers.providers.BaseProvider('any')
  ),
};

export const SmartContractActions = {
  ATTACH_WALLET: 'ATTACH_WALLET',
  DETACH_WALLET: 'DETACH_WALLET',
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
            SmartContractAddresses.PaymentToken,
            wallet.provider.getSigner()
          ),
          Job: Job__factory.connect(
            SmartContractAddresses.Job,
            wallet.provider.getSigner()
          ),
        };
      }

      return state;
    }
    case SmartContractActions.UPDATE_ERC20_APPROVAL: {
      state = {
        ...state,
        isERC20Approved: action.payload.approved,
      };
      return state;
    }
    default: {
      return state;
    }
  }
};
