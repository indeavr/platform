import { createContext } from 'react';
import {
  SmartContractState,
  initialSmartContractsState,
  SmartContractAction,
} from 'components/smart-contracts/SmartContractReducer';

export type ISmartContractContext = {
  contractsState: SmartContractState;
  dispatch: (arg0: SmartContractAction) => void;
};

const defaultSmartContractsContextValue = {
  contractsState: initialSmartContractsState,
  dispatch: () => {},
};

export const SmartContractContext = createContext<ISmartContractContext>(
  defaultSmartContractsContextValue
);
