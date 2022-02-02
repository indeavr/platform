import React, { useEffect, useState } from 'react';
import {
  useSmartContracts,
  SmartContractActions,
} from 'components/smart-contracts/useSmartContracts';
import { constants } from 'ethers';
import { Modal } from 'components/ui/Modal';

export const ApproveERC20 = ({
  show,
  onFinish,
}: {
  show: boolean;
  onFinish: () => void;
}) => {
  const { contractsState, dispatch } = useSmartContracts();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!show) {
      return;
    }

    // if approved, clear the state - we're done
    if (
      contractsState.isERC20Approved &&
      contractsState.currentTxState !== 'finished'
    ) {
      if (contractsState.currentTxId === 'approveERC20') {
        dispatch({
          type: SmartContractActions.UPDATE_TRANSACTION_STATE,
          payload: {
            txTypeId: 'approveERC20',
            txTypeState: 'finished',
          },
        });
      }
      return;
    }

    // start
    if (!contractsState.currentTxId) {
      dispatch({
        type: SmartContractActions.UPDATE_TRANSACTION_STATE,
        payload: {
          txTypeId: 'approveERC20',
          txTypeState: 'begin',
        },
      });
      return;
    }

    // bail if not our txid
    if (contractsState.currentTxId !== 'approveERC20') {
      return;
    }

    // if beginning, start the wallet transaction
    if (contractsState.currentTxState === 'begin') {
      contractsState.ERC20 &&
        contractsState.ERC20.approve(
          process.env.REACT_APP_JOB_CONTRACT_ADDRESS ?? '',
          constants.MaxUint256
        ).catch((e: any) => {
          setErrorMessage(e.message || 'Unknown error');

          // catch error
          dispatch({
            type: SmartContractActions.UPDATE_TRANSACTION_STATE,
            payload: {
              txTypeId: 'approveERC20',
              txTypeState: 'error',
            },
          });
        });

      dispatch({
        type: SmartContractActions.UPDATE_TRANSACTION_STATE,
        payload: {
          txTypeId: 'approveERC20',
          txTypeState: 'waiting',
        },
      });

      return;
    }

    if (contractsState.currentTxState === 'finished') {
      dispatch({
        type: SmartContractActions.UPDATE_TRANSACTION_STATE,
        payload: {
          txTypeId: undefined,
          txTypeState: undefined,
        },
      });

      onFinish();
    }

    return;
  }, [contractsState, show, dispatch, onFinish]);

  let showModal = false;
  let showErrorModal = false;

  if (!show || contractsState.currentTxState === 'finished') {
    showModal = false;
    showErrorModal = false;
  } else if (contractsState.currentTxState === 'error') {
    showModal = false;
    showErrorModal = true;
  } else {
    showModal = true;
    showErrorModal = false;
  }

  return (
    <>
      <Modal
        title="Approving Spending Allowance"
        icon="ClockIcon"
        isOpen={showModal}
      >
        <p>
          Please accept this transaction wait for it to confirm on the
          blockchain.
        </p>
      </Modal>
      <Modal
        title="There was an error"
        icon="ExclamationIcon"
        isOpen={showErrorModal}
        onRequestClose={() => {
          dispatch({
            type: SmartContractActions.UPDATE_TRANSACTION_STATE,
            payload: {
              txTypeId: 'approveERC20',
              txTypeState: 'finished',
            },
          });
        }}
      >
        <p>The following error occurred:</p>
        <p>{errorMessage}</p>
      </Modal>
    </>
  );
};
