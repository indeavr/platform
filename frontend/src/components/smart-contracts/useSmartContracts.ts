import { SmartContractContext } from 'components/smart-contracts/SmartContractContext';
import { useContext } from 'react';

export const useSmartContracts = () => {
  return useContext(SmartContractContext);
};

export { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
export { SmartContractActions } from 'components/smart-contracts/SmartContractReducer';
