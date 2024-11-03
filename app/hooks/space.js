import { useEffect } from "react";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { spaceStateAtom, spaceStateSelector } from "../recoil/state";

const useFetchSpaces = () => {
  const [spaceState, setSpaceState] = useRecoilState(spaceStateAtom);
  const spaceLoadable = useRecoilValueLoadable(spaceStateSelector);

  useEffect(() => {
    if (spaceLoadable.state === "hasValue" && spaceState.length === 0) {
      setSpaceState(spaceLoadable.contents);
    }
  }, [
    spaceLoadable.state,
    setSpaceState,
    spaceLoadable.contents,
    spaceState.length,
  ]);

  return spaceState;
};

export default useFetchSpaces;
