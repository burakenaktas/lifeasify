import '../styles/onboarding.css';

const EXAMPLE_CHORES = [
  { label: '🗑️ Take out the trash', id: 0 },
  { label: '🧼 Do the dishes', id: 1 },
  { label: '🛀 Clean the bathroom', id: 2 },
  { label: '🧹 Vacuum the floor', id: 3 },
  { label: '💇‍♀️ Cut the hair', id: 4 },
];

function OnboardingStepOne() {
  return (
    <div>
      <h1 className="onboarding-title">Select your repeated chore</h1>

      <div className="bg-white">
        {EXAMPLE_CHORES.map((chore) => (
          <div key={chore.id} className="chore-types">
            {chore.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OnboardingStepOne;
