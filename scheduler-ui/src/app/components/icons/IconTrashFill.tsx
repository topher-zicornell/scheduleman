// icon:trash-fill | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import * as React from "react";

function IconTrashFill(props: React.SVGProps<SVGSVGElement>) {
  return (
      <svg
          fill="currentColor"
          viewBox="0 0 16 16"
          height="1em"
          width="1em"
          {...props}
      >
        <path d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5v7a.5.5 0 01-1 0v-7a.5.5 0 011 0z" />
      </svg>
  );
}

export default IconTrashFill;
