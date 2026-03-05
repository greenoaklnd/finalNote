// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopicsPage from "./pages/TopicsPage";
import TopicCategoryPage from "./pages/TopicCategoryPage";
import CategoryPage from "./pages/CategoryPage";
import PaperViewPage from "./pages/PaperViewPage"
import FilteredPaperViewPage from "./pages/FilteredPaperViewPage";
import TopicManagerPage from "./pages/TopicManagerPage";
import CalendarPage from "./pages/CalenderPage";
import MorningPage from "./pages/MorningPage";
import AfternoonPage from "./pages/AfternoonPage";
import WorkPage from "./pages/WorkPage";
import EveningPage from "./pages/EveningPage";

 const topics = {
   God : ["walk","study","Thanksgiving","prayer","Jesus","Verses","Principalities","to research","Fasting","interesting","podcasts","The Return","OT / NT","Angels & Demons","OT","Keys and other","Study structure","Bible to-do",],
   Self : [ "Current/schedule", "For Tomorrow","overview","P&P","Evening P&P","PTT","daytime","hygiene","interruptions/transitions/ideas/tasks","food","Time","Wake","Last night", "Mornings","Evenings","appointments/meetings","attention","Sleep","Mind/Mood","blue","blue mangos","meals","health","calls","Discipline","dreams",],
   Family : ["Baby","mercy","Joshua", "dad", "Fatherhood", "Tsega/Abe/Mom","family to-do",],
   TASKS : ["To-do",],
   Buy : ["to-buy","to-order","inventory/model#"],
   Eurgo : ["ideas","summit", "Work Enviornment","cmc","cafe/office", "bag","eurgo to-do",],
   House : ["observation/ideas", "Repair skill /diy","summit apt", "cmc house","inventory/model", "house to-do", "to-buy", "dog","rental skills", ],
   Money : ["urgent/to-do","notes","to-buy","bills","money to-do","income/job","Purchases","tracking","grocery","order list","wishlist", ],
   Code: ["to-do","questions & ideas","new code", "prayer-app","note","money","hizab","completed","code to-do",],
   Business : ["Business","22 Cafe","Chicken","business to-do",],
   Car : ["ideas/plans", "studyy","issues", "order","upcoming service", "history", "car to-do",],
   Evening :["completion, Evening plan","Body & Mind, Evening Transition","Entertainment","closing routine","Night routine"],
   study : ["conspiracies","audio","tabs","Tech","Tech repair","art", "music","Words", "Amharic","podcast/videos/post","study to-do","inventory & model#",],
   Bible : ["Matthew","Mark","Luke","John","1 Peter",],
   
 };


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopicsPage topics={topics} />} />
        <Route
          path="/topic/:topicName"
          element={<TopicCategoryPage topics={topics} />}
        />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/paperview" element={<PaperViewPage />} />
        <Route path="/paperview/:category" element={<PaperViewPage />} />
        <Route path="/paperview/filter" element={<FilteredPaperViewPage topics={topics} />} />
        <Route path="/topics/manage" element={<TopicManagerPage topics={topics}  />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/morning" element={<MorningPage />} />
        <Route path="/afternoon" element={<AfternoonPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/evening" element={<EveningPage />} />
      </Routes>
    </Router>
  );
}
