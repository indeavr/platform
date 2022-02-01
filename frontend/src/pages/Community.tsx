import { useState } from 'react';
import { useContracts } from 'components/blockchain-contracts/useContracts';

const Community = () => {
  const [ownerAddress, setOwnerAddress] = useState<string | undefined>(
    undefined
  );
  const contracts = useContracts();

  const getContractOwner = async () => {
    if (!contracts.Job) {
      return;
    }
    const owner = await contracts.Job.owner();
    setOwnerAddress(owner);
  };

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
        <pre>{contracts.isERC20Approved ? 'YES' : 'NO'}</pre>
      </div>
      <div className="mt-2">
        {!contracts.isERC20Approved && (
          <button
            onClick={contracts.approveERC20}
            type="button"
            className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Approve
          </button>
        )}
        {contracts.isERC20Approved && (
          <button
            onClick={contracts.revokeERC20}
            type="button"
            className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Revoke
          </button>
        )}
      </div>
    </>
  );
};

export default Community;
