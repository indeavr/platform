import React from 'react';
import {
  useSmartContracts,
  SmartContractActions,
  SmartContractAddresses,
} from 'components/smart-contracts/useSmartContracts';
import { TransactionModal } from 'components/smart-contracts/TransactionModal';
import { ethers } from 'ethers';

export const RevokeERC20 = ({
  show,
  onFinish,
}: {
  show: boolean;
  onFinish: () => void;
}) => {
  const { contractsState, dispatch } = useSmartContracts();

  const onBegin = async () => {
    return contractsState.ERC20.approve(SmartContractAddresses.Job, 0);
  };

  const onConfirmed = (receipt: ethers.providers.TransactionReceipt) => {
    dispatch({
      type: SmartContractActions.UPDATE_ERC20_APPROVAL,
      payload: { approved: false },
    });
  };

  return (
    <>
      <TransactionModal
        title="Revoke Spending Allowance"
        {...{ show, onBegin, onConfirmed, onFinish }}
      ></TransactionModal>
    </>
  );
};
