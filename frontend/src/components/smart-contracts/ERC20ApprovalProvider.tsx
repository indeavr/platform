import { Listener } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import {
  useSmartContracts,
  SmartContractActions,
} from 'components/smart-contracts/useSmartContracts';
import { useWallet, useWalletFilter } from 'components/wallet/useWallet';

export const ERC20ApprovalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallet = useWallet();
  const { contractsState, dispatch } = useSmartContracts();

  // attach the filter handler
  const onApprovalHandler: Listener = (owner, spender, approvalAmount) => {
    dispatch({
      type: SmartContractActions.UPDATE_ERC20_APPROVAL,
      payload: { approved: BigNumber.from(approvalAmount).gt(0) },
    });
  };

  // attach a filter
  useWalletFilter(
    contractsState,
    contractsState.ERC20,
    () => {
      if (wallet.account) {
        return contractsState.ERC20.filters.Approval(
          wallet.account,
          process.env.REACT_APP_JOB_CONTRACT_ADDRESS ?? ''
        );
      }
    },
    onApprovalHandler
  );

  return <>{children}</>;
};
