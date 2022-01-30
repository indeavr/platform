import { createContext } from 'react';
import { Job, ERC20 } from 'contracts-typechain';

export type IBlockchainContractContext = {
  Job: Job | undefined;
  ERC20: ERC20 | undefined;
  isERC20Approved: boolean;
  approveERC20: () => void;
  revokeERC20: () => void;
};

export const defaultBlockchainContractValue = {
  Job: undefined,
  ERC20: undefined,
  isERC20Approved: false,
  approveERC20: () => {},
  revokeERC20: () => {},
};

export const BlockchainContractContext =
  createContext<IBlockchainContractContext>(defaultBlockchainContractValue);
