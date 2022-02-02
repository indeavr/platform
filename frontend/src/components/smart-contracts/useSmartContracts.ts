import { SmartContractContext } from 'components/smart-contracts/SmartContractContext';
import { useContext } from 'react';

export { SmartContractActions } from 'components/smart-contracts/SmartContractReducer';

export const useSmartContracts = () => {
  return useContext(SmartContractContext);
};
