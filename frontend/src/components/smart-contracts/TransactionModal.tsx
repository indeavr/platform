import React, { useEffect, useState } from 'react';
import { ContractTransaction } from 'ethers';
import { Modal } from 'components/ui/Modal';
import { ethers } from 'ethers';

export type BeginCallback = () => Promise<ContractTransaction>;
export type ConfirmedCallback = (
  receipt: ethers.providers.TransactionReceipt
) => void;
export type TransactionError = {
  message: string;
};

enum TXStatus {
  Begin = 'Begin',
  Waiting = 'Waiting',
  Finished = 'Finished',
  Error = 'Error',
}

export const TransactionModal = ({
  title,
  show,
  onBegin,
  onConfirmed,
  onFinish,
}: {
  title: string;
  show: boolean;
  onBegin: BeginCallback;
  onConfirmed?: ConfirmedCallback;
  onFinish: () => void;
}) => {
  const [txStatus, setTxStatus] = useState<TXStatus>(TXStatus.Begin);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!show) {
      if (txStatus === TXStatus.Finished) {
        setTxStatus(TXStatus.Begin);
      }

      return;
    }

    // if beginning, start the wallet transaction
    if (txStatus === TXStatus.Begin) {
      onBegin()
        .then((tx: ContractTransaction) => {
          tx.wait()
            .then((receipt: ethers.providers.TransactionReceipt) => {
              // completed the transaction
              if (onConfirmed) {
                onConfirmed(receipt);
              }
              setTxStatus(TXStatus.Finished);
            })
            .catch((e: TransactionError) => {
              setErrorMessage(e.message || 'Unknown error');
              setTxStatus(TXStatus.Error);
            });
        })
        .catch((e: TransactionError) => {
          setErrorMessage(e.message || 'Unknown error');
          setTxStatus(TXStatus.Error);
        });

      setTxStatus(TXStatus.Waiting);

      return;
    }

    if (txStatus === TXStatus.Finished) {
      onFinish();
    }

    return;
  }, [txStatus, show, onBegin, onConfirmed, onFinish]);

  let showModal = false;
  let showErrorModal = false;

  if (!show || txStatus === TXStatus.Finished) {
    showModal = false;
    showErrorModal = false;
  } else if (txStatus === TXStatus.Error) {
    showModal = false;
    showErrorModal = true;
  } else {
    showModal = true;
    showErrorModal = false;
  }

  return (
    <>
      <Modal title={title} icon="ClockIcon" isOpen={showModal}>
        <p>
          Please accept this transaction in your wallet and wait for it to
          confirm on the blockchain.
        </p>
      </Modal>
      <Modal
        title="There was an error"
        icon="ExclamationIcon"
        isOpen={showErrorModal}
        onRequestClose={() => {
          setTxStatus(TXStatus.Finished);
        }}
      >
        <p>The following error occurred:</p>
        <p>{errorMessage}</p>
      </Modal>
    </>
  );
};
