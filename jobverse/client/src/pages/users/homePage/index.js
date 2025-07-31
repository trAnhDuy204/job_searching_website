import{ memo } from "react";
import HomeContent from "./homeContent";
import 'react-multi-carousel/lib/styles.css';
const HomePage = () =>{
    return (
      <div className="bg-gray-100 min-h-screen">
        <HomeContent />
      </div>
    );
}

export default memo(HomePage);