import React from 'react';
import {
  useSmartContracts,
  SmartContractActions,
  SmartContractAddresses,
} from 'components/smart-contracts/useSmartContracts';
import { TransactionModal } from 'components/smart-contracts/TransactionModal';
import { ethers, constants } from 'ethers';

export const ApproveERC20 = ({
  show,
  onFinish,
}: {
  show: boolean;
  onFinish: () => void;
}) => {
  const { contractsState, dispatch } = useSmartContracts();

  // the logic called to initiate the transaction
  const onBegin = async () => {
    return contractsState.ERC20.approve(
      SmartContractAddresses.Job,
      constants.MaxUint256
    );
  };

  // what to do when the transaction is confirmed on the blockchain
  const onConfirmed = (receipt: ethers.providers.TransactionReceipt) => {
    dispatch({
      type: SmartContractActions.UPDATE_ERC20_APPROVAL,
      payload: { approved: true },
    });
  };

  // render the transaction modal
  return (
    <>
      <TransactionModal
        title="Approving Spending Allowance"
        {...{ show, onBegin, onConfirmed, onFinish }}
      ></TransactionModal>
    </>
  );
};