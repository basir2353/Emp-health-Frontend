import React from "react";

import WalllnesBox1 from "./Wallnesboxses/WalllnesBox1";
import WalnessBox2 from "./Wallnesboxses/WalnessBox2";
import WallnessBox3 from "./Wallnesboxses/WallnessBox3";


const Walnessbox: React.FC = () => {
  
 

  return (
    <div className="flex justify-center max-lg:flex max-lg:flex-col">
      <div className="flex max-lg:flex-col justify-between gap-5 mt-6">
        <div>
          <WalllnesBox1 />
        </div>
        <div>
          <WalnessBox2 />
        </div>
        <div>
        <WallnessBox3/>
        </div>
      </div>
    </div>
  );
};

export default Walnessbox;
