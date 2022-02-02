import React, { useEffect, useReducer } from 'react';
import { useWallet } from 'components/wallet/useWallet';
import { ERC20ApprovalProvider } from 'components/smart-contracts/ERC20ApprovalProvider';
import { Modal } from 'components/ui/Modal';
import {
  smartContractReducer,
  initialSmartContractsState,
  SmartContractActions,
} from 'components/smart-contracts/SmartContractReducer';
import { SmartContractContext } from 'components/smart-contracts/SmartContractContext';

export const ContractInteractionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallet = useWallet();

  // connect wallet when wallet is changed
  useEffect(() => {
    dispatch({
      type: SmartContractActions.ATTACH_WALLET,
      payload: { wallet: wallet },
    });
    return () => {
      // run when unmounting
      dispatch({
        type: SmartContractActions.DETACH_WALLET,
        payload: {},
      });
    };
  }, [wallet]);

  // create a reducer
  const [contractsState, dispatch] = useReducer(
    smartContractReducer,
    initialSmartContractsState
  );

  // create a context to pass down the reducer
  const initialSmartContractsContext = {
    contractsState: contractsState,
    dispatch: dispatch,
  };

  return (
    <SmartContractContext.Provider value={initialSmartContractsContext}>
      <ERC20ApprovalProvider>{children}</ERC20ApprovalProvider>

      <Modal
        title="Confirming Approval"
        icon="ClockIcon"
        isOpen={contractsState.approvingERC20}
      >
        <p>Please wait for this transaction to confirm on the blockchain.</p>
      </Modal>
      <Modal
        title="Revoking Approval"
        icon="ClockIcon"
        isOpen={contractsState.revokingERC20}
      >
        <p>Please wait for this transaction to confirm on the blockchain.</p>
      </Modal>
    </SmartContractContext.Provider>
  );
};
