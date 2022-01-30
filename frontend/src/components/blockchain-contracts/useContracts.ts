import { BlockchainContractContext } from 'components/blockchain-contracts/BlockchainContractContext';
import { useContext } from 'react';

export const useContracts = () => {
  return useContext(BlockchainContractContext);
};
