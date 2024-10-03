// import { useState } from 'react';
// import '../styles/onboarding.css';
// import Chore from '../../types/types';

// type ExampleChore = {
//   label: string;
//   id: number;
// };

// const EXAMPLE_CHORES: ExampleChore[] = [
//   { label: '🗑️ Take out the trash', id: 0 },
//   { label: '🧼 Do the dishes', id: 1 },
//   { label: '🛀 Clean the bathroom', id: 2 },
//   { label: '🧹 Vacuum the floor', id: 3 },
//   { label: '💇‍♀️ Cut the hair', id: 4 },
// ];

// function OnboardingStepOne() {
//   const [selectedChore, setSelectedChore] = useState<Chore | null>(null);

//   return (
//     <div className="w-full h-full flex flex-col justify-center items-center">
//       <h1 className="onboarding-title">Select your repeated chore</h1>

//       <div className="gap-6 w-4/5 flex flex-wrap justify-center items-center">
//         {EXAMPLE_CHORES.map((chore) => {
//           const isSelected = selectedChore
//             ? selectedChore.id === chore.id
//             : false;

//           return (
//             <div
//               key={chore.id}
//               className={`chore-types ${isSelected ? 'selected' : ''}`}
//               onClick={() => setSelectedChore(chore)}
//             >
//               {chore.label}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default OnboardingStepOne;
