import React, { useState, useMemo, useEffect } from 'react';
import { useWallet } from 'components/wallet/useWallet';
import { Job__factory } from 'contracts-typechain';
import { ERC20, ERC20__factory } from 'contracts-typechain';
import { constants, BigNumber } from 'ethers';
import { Listener } from '@ethersproject/providers';
import { Modal } from 'components/ui/Modal';

import {
  BlockchainContractContext,
  defaultBlockchainContractValue,
} from 'components/blockchain-contracts/BlockchainContractContext';

export const ContractInteractionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallet = useWallet();

  const [isERC20Approved, setIsERC20Approved] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // connect the contracts via the wallet once
  const contracts = useMemo(() => {
    if (wallet.provider !== null) {
      const ERC20 = ERC20__factory.connect(
        process.env.REACT_APP_PAYMENT_TOKEN_CONTRACT_ADDRESS ?? '',
        wallet.provider.getSigner()
      );

      return {
        Job: Job__factory.connect(
          process.env.REACT_APP_JOB_CONTRACT_ADDRESS ?? '',
          wallet.provider.getSigner()
        ),
        ERC20: ERC20,
        approveERC20: async () => {
          setShowModal(true);
          try {
            await ERC20.approve(
              process.env.REACT_APP_JOB_CONTRACT_ADDRESS ?? '',
              constants.MaxUint256
            );
          } catch (e: any) {
            setShowModal(false);
          }
        },
        revokeERC20: async () => {
          setShowModal(true);
          try {
            await ERC20.approve(
              process.env.REACT_APP_JOB_CONTRACT_ADDRESS ?? '',
              '0'
            );
          } catch (e: any) {
            setShowModal(false);
          }
        },
      };
    }

    return undefined;
  }, [wallet]);

  const checkERC20Approval = async () => {
    if (contracts) {
      const approvalAmount = await contracts.ERC20.allowance(
        wallet.account ?? '',
        process.env.REACT_APP_JOB_CONTRACT_ADDRESS ?? ''
      );
      setIsERC20Approved(BigNumber.from(approvalAmount).gt(0));
    }
    return false;
  };

  // update the state when the event is heard
  const listenForERC20Events = async (ERC20: ERC20) => {};

  // add additional methods based on the contracts
  const contextValue = useMemo(
    () => {
      // add the approval when isERC20Approved state changes
      if (contracts) {
        return {
          ...contracts,
          isERC20Approved: isERC20Approved,
        };
      }

      return defaultBlockchainContractValue;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contracts, isERC20Approved]
  );

  // add events

  const onApprovalHandler: Listener = (owner, spender, approvalAmount) => {
    setIsERC20Approved(BigNumber.from(approvalAmount).gt(0));
    setShowModal(false);
  };

  const attachEvents = () => {
    if (contracts) {
      checkERC20Approval();
      const erc20Filter = contracts.ERC20.filters.Approval(
        wallet.account ?? '',
        process.env.REACT_APP_JOB_CONTRACT_ADDRESS ?? ''
      );
      contracts.ERC20.off(erc20Filter, onApprovalHandler);
      contracts.ERC20.on(erc20Filter, onApprovalHandler);
    }
  };
  const detachEvents = () => {
    if (contracts) {
      const erc20Filter = contracts.ERC20.filters.Approval(
        wallet.account ?? '',
        process.env.REACT_APP_JOB_CONTRACT_ADDRESS ?? ''
      );
      contracts.ERC20.off(erc20Filter, onApprovalHandler);
    }
  };

  // clean up
  useEffect(() => {
    attachEvents();
    return () => {
      // run when unmounting
      detachEvents();
    };
  });

  return (
    <BlockchainContractContext.Provider value={contextValue}>
      {children}

      <Modal title="Confirming Transaction" icon="ClockIcon" isOpen={showModal}>
        <p>Please wait for this transaction to confirm on the blockchain.</p>
      </Modal>
    </BlockchainContractContext.Provider>
  );
};
