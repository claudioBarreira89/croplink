import { useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";

const useListActions = (refetch: Function) => {
  const [item, setItem] = useState<number | undefined>();
  const [action, setAction] = useState<string | undefined>();

  const { config: deleteProduceConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "deleteProduce",
    args: [item],
  });
  const {
    write: deleteWrite,
    data: deleteData,
    isLoading: isDeleteLoading,
  } = useContractWrite(deleteProduceConfig);

  const deleteTransaction = useWaitForTransaction({ hash: deleteData?.hash });

  const onDeleteItem = (index: number) => {
    setItem(index);
    setAction("delete");
  };

  useEffect(() => {
    if (action === "delete") {
      setAction("");
      return deleteWrite && deleteWrite();
    }
  }, [action, deleteWrite]);

  useEffect(() => {
    if (deleteTransaction.isSuccess) refetch();
  }, [deleteTransaction.isSuccess, refetch]);

  return {
    setItem,
    onDeleteItem,
    deleteLoading: (isDeleteLoading || deleteTransaction.isLoading) && item,
  };
};

export default useListActions;
