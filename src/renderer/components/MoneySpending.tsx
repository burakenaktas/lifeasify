function MoneySpending() {
  return (
    <div className="flex flex-col justify-center items-center container">
      <div className="w-full flex justify-center items-center">
        <div
          aria-hidden="true"
          className="bg-green-600 rounded-full px-6 py-1 my-2 text-xl cursor-pointer hover:bg-blue-700"
          onClick={() => push('/create-chore')}
        >
          Add Spending
        </div>
      </div>
    </div>
  );
}

export default MoneySpending;
