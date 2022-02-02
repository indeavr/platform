import { useState } from 'react';
import {
  useSmartContracts,
  SmartContractActions,
} from 'components/smart-contracts/useSmartContracts';

import { ApproveERC20 } from 'components/smart-contracts/ApproveERC20';

const Community = () => {
  const [ownerAddress, setOwnerAddress] = useState<string | undefined>(
    undefined
  );
  const { contractsState, dispatch } = useSmartContracts();

  const getContractOwner = async () => {
    if (!contractsState.Job) {
      return;
    }
    const owner = await contractsState.Job.owner();
    setOwnerAddress(owner);
  };

  const [showApproveERC20, setShowApproveERC20] = useState(false);

  // find Icon types at https://unpkg.com/browse/@heroicons/react@1.0.5/outline/index.js
  return (
    <>
      <div>Community</div>

      <div className="mt-5">
        <pre>owner: {ownerAddress}</pre>
        <div className="mt-2">
          <button
            onClick={getContractOwner}
            type="button"
            className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Get Contract Owner
          </button>
        </div>
      </div>

      <div className="mt-5">
        Is ERC 20 token approved?
        <pre>{contractsState.isERC20Approved ? 'YES' : 'NO'}</pre>
      </div>
      <div className="mt-2">
        {!contractsState.isERC20Approved && (
          <button
            onClick={() => {
              setShowApproveERC20(true);
            }}
            type="button"
            className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Approve
          </button>
        )}
        {contractsState.isERC20Approved && (
          <button
            onClick={() => {
              dispatch({
                type: SmartContractActions.REVOKE_ERC20,
                payload: {},
              });
            }}
            type="button"
            className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Revoke
          </button>
        )}
      </div>

      <ApproveERC20
        show={showApproveERC20}
        onFinish={() => setShowApproveERC20(false)}
      ></ApproveERC20>
    </>
  );
};

export default Community;
