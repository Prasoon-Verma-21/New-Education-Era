import React from 'react';

const FAQ = () => {
  return (
    <div className="min-h-screen pt-5 px-8  bg-gradient-to-b from-gray-50 via-blue-100 to-white">
      <h1 className="text-4xl font-semibold mt-12 mb-2 text-center text-blue-900">Frequently Asked Questions</h1>
      <p className="text-center max-w-4xl mx-auto  ">
        Here are some common questions regarding financial support for education, along with their answers.
      </p>

      <div className="space-y-8 ">
        <section>
          <h2 className="text-2xl font-bold mb-4 ">General Questions</h2>
          <ul className="space-y-4">
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  p-4 rounded-lg shadow-md">
              <h3 className="font-semibold">1. What types of financial support are available for students?</h3>
              <p>Students can access scholarships, grants, education loans, and stipends to help finance their education.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  p-4 rounded-lg shadow-md">
              <h3 className="font-semibold">2. How do I apply for scholarships?</h3>
              <p>Most scholarships require a separate application process. Visit the scholarship provider's website for details on eligibility and application procedures.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  p-4 rounded-lg shadow-md">
              <h3 className="font-semibold">3. What is the difference between a grant and a scholarship?</h3>
              <p>Grants are typically need-based financial aid, while scholarships are usually merit-based awards that do not require repayment.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  p-4 rounded-lg shadow-md">
              <h3 className="font-semibold">4. Can I apply for multiple scholarships at once?</h3>
              <p>Yes, you can apply for multiple scholarships. However, be sure to read the application guidelines for each scholarship.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  p-4 rounded-lg shadow-md">
              <h3 className="font-semibold">5. Are there scholarships specifically for women?</h3>
              <p>Yes, many organizations offer scholarships specifically for women pursuing education in various fields.</p>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Loan and Repayment Questions</h2>
          <ul className="space-y-4">
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  rounded-lg shadow-md">
              <h3 className="font-semibold">6. How do I apply for an education loan?</h3>
              <p>To apply for an education loan, research different lenders, gather required documents, and complete the loan application form.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  rounded-lg shadow-md">
              <h3 className="font-semibold">7. What documents are required for a loan application?</h3>
              <p>Common documents include identity proof, admission letter, income proof, and bank statements.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  rounded-lg shadow-md">
              <h3 className="font-semibold">8. What is the interest rate on education loans?</h3>
              <p>Interest rates on education loans vary by lender and can range from 8% to 14% per annum.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  rounded-lg shadow-md">
              <h3 className="font-semibold">9. Is there a repayment grace period for education loans?</h3>
              <p>Most education loans offer a grace period of 6 months to 1 year after course completion before repayments start.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  rounded-lg shadow-md">
              <h3 className="font-semibold">10. Can I repay my education loan early?</h3>
              <p>Yes, many lenders allow prepayment of education loans without penalties. Check your loan agreement for specifics.</p>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Miscellaneous Questions</h2>
          <ul className="space-y-4">
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  rounded-lg shadow-md">
              <h3 className="font-semibold">11. How can I find scholarships that suit my profile?</h3>
              <p>Websites like Scholarships.com, College Board, and local educational institutions can help you find scholarships matching your profile.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  rounded-lg shadow-md">
              <h3 className="font-semibold">12. Are there any scholarships for students with disabilities?</h3>
              <p>Yes, many organizations offer scholarships specifically for students with disabilities.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  rounded-lg shadow-md">
              <h3 className="font-semibold">13. Can I appeal a scholarship decision?</h3>
              <p>Some scholarship programs allow appeals. Check the scholarship provider's guidelines for their specific process.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  rounded-lg shadow-md">
              <h3 className="font-semibold">14. How can I avoid scholarship scams?</h3>
              <p>Research the scholarship provider and never pay an application fee for scholarships. Legitimate scholarships do not require fees.</p>
            </li>
            <li className=" bg-white hover:bg-gray-100 border border-gray-300  rounded-lg shadow-md ">
              <h3 className="font-semibold ">15. What happens if I do not repay my education loan?</h3>
              <p>Failure to repay an education loan can lead to penalties, a lower credit score, and legal action by the lender.</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FAQ;
