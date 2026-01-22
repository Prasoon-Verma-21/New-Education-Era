import React from "react";

const Loans = () => {
  const loansData = [
    {
      category: "Government Education Loans",
      loans: [
        {
          title: "State Bank of India Education Loan",
          description:
            "State Bank of India (SBI) offers a comprehensive education loan scheme to students who wish to pursue higher education in India or abroad. With flexible repayment options and competitive interest rates, SBI provides financing for tuition fees, accommodation, and other academic expenses. The loan comes with the benefit of a moratorium period, where repayment starts after the completion of the course, making it a suitable choice for students without an immediate income source. SBI also offers easy documentation and online application processes.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVw3uMF52A50ej3HNO-S9V6WpYWT8z6d5iqg&s",
          link: "https://www.sbi.co.in/web/personal-banking/loans/education-loans",
        },
        {
          title: "Punjab National Bank Udaan Education Loan",
          description:
            "Punjab National Bank (PNB) provides the Udaan Education Loan to students pursuing professional and technical courses in India or abroad. This loan comes with affordable interest rates, and PNB offers funding for tuition fees, examination fees, hostel charges, and other education-related expenses. The loan is designed with easy repayment terms and allows for a grace period during the course period, making it accessible for students from all backgrounds. PNB also offers special schemes for students with disabilities and economically weaker sections.",
          image: "https://pnbcsl.in/HOME_LOAN/143/InnerBanner.png",
          link: "https://www.pnbindia.in/education-loan.html",
        },
        {
          title: "Canara Bank Vidya Turant Loan",
          description:
            "Canara Bank's Vidya Turant Loan is aimed at students who have secured admission to top institutions in India. The loan is designed for quick disbursement and offers financing for both tuition and non-tuition fees. The loan offers flexible repayment terms and low interest rates, with no collateral required for loans up to a certain limit. This product is ideal for students who require a fast-track education loan and are seeking to study at prestigious institutions.",
          image: "https://canarabank.com/img/UploadedFiles/InternalBanner/Files/English/a4ffac822f4e4a548460153c4cf4971e.jpg",
          link: "https://www.canarabank.com/english/loans/education-loan/vidya-turant/",
        },
        {
          title: "Bank of Baroda Education Loan",
          description:
            "Bank of Baroda offers an Education Loan with a focus on overseas studies, making it an excellent choice for students wishing to study abroad. The loan comes with competitive interest rates and a streamlined application process, making it easy for students to get started with their education financing. With a flexible repayment schedule and low processing fees, Bank of Baroda ensures that students can focus on their studies without the burden of financial stress. The loan also covers a wide range of academic courses.",
          image: "https://cdn.unicreds.com/blog/wp-content/uploads/2022/02/31161801/UNICREDS-11.jpg",
          link: "https://www.bankofbaroda.in/personal-banking/loans/education-loan",
        },
      ],
    },
    {
      category: "Private Bank Education Loans",
      loans: [
        {
          title: "HDFC Credila Education Loan",
          description:
            "HDFC Credila specializes in education loans and provides tailored solutions for students wishing to pursue higher education in India and abroad. The loan covers a wide range of academic expenses, including tuition fees, hostel fees, and other expenses related to the course. HDFC Credila offers flexible repayment options, with the possibility of deferring repayments until after course completion. With easy documentation and fast approval, HDFC Credila is a reliable choice for students looking for a hassle-free loan experience.",
          image: "https://www.searcheducation.com/img/hdfc-credila.png",
          link: "https://www.hdfccredila.com",
        },
        {
          title: "ICICI Bank Education Loan",
          description:
            "ICICI Bank provides students with education loans to study at recognized institutions across India and abroad. With simple documentation and a quick approval process, ICICI Bank ensures that the loan is disbursed efficiently. The loan covers all essential expenses, including tuition fees, accommodation, and other course-related costs. ICICI also offers attractive interest rates and flexible repayment schedules, with the option for a moratorium period until after graduation.",
          image: "https://loans.icicibank.com/loans/education-loan/assets/Images/landing_page/banner-mobile1.jpg",
          link: "https://www.icicibank.com/education-loan",
        },
        {
          title: "Axis Bank Education Loan",
          description:
            "Axis Bank offers education loans for both domestic and international studies. With competitive interest rates and a variety of repayment options, Axis Bank ensures that students can repay their loans comfortably after course completion. The loan covers all education-related expenses, including tuition fees, travel expenses, and accommodation charges. Axis Bank also offers flexible loan amounts and easy documentation to make the loan process straightforward and hassle-free for students.",
          image: "https://static.wixstatic.com/media/f836e8_5aca528579ce4e1c9c5def96fb8f4c9a~mv2.webp/v1/fill/w_266,h_169,al_c,lg_1,q_80,enc_auto/Axis%20Bank%20Logo.webp",
          link: "https://www.axisbank.com/retail/loans/education-loan",
        },
        {
          title: "Kotak Mahindra Bank Education Loan",
          description:
            "Kotak Mahindra Bank provides education loans with customized repayment options and low processing fees. The bank's loan product covers all major expenses for students pursuing higher education in India and abroad. Kotak Mahindra offers competitive interest rates and flexible loan terms, making it a good choice for students looking for financial support during their studies. The bank also provides additional benefits, including quick disbursement and easy documentation.",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/8/331710765/OS/OL/FI/70315489/kotak-mahindra-bank-personal-loan.png",
          link: "https://www.kotak.com/en/personal-banking/loans/education-loan.html",
        },
      ],
    },
    {
      category: "Non-Banking Financial Companies (NBFCs)",
      loans: [
        {
          title: "Avanse Education Loan",
          description:
            "Avanse Education Loans offer customized solutions for students in India and abroad. The loan covers a wide array of academic expenses, including tuition fees, books, and hostel charges. Avanse specializes in offering loans for various professional and technical courses, including MBAs and engineering degrees. With flexible repayment plans and quick disbursement, Avanse aims to provide financial support to students across the country, with a streamlined application process.",
          image: "https://kedaara.com/wp-content/uploads/2023/01/Avanse-logo_FINAL.png",
          link: "https://www.avanse.com",
        },
        {
          title: "InCred Education Loan",
          description:
            "InCred provides quick and easy education loans with minimal documentation requirements. The loan covers a wide range of academic expenses, from tuition to accommodation and travel expenses for students studying abroad. InCred offers flexible repayment options, and the loan approval process is quick and simple, making it an attractive option for students who need immediate financial assistance. The bank also offers various other services to help students with their education financing needs.",
          image: "https://cdn.unicreds.com/blog/wp-content/uploads/2022/02/31165143/UNICREDS-20.jpg",
          link: "https://www.incred.com",
        },
        {
          title: "Auxilo Education Loan",
          description:
            "Auxilo offers education loans with customized repayment plans to students seeking higher education in India and abroad. The loan covers various expenses, including tuition, accommodation, and other course-related fees. Auxilo's simple application process and low interest rates make it an appealing option for students looking for financial assistance. The company is known for offering flexible loan amounts based on the needs of the student, ensuring accessibility for students across different income brackets.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWvc2o_LF9T9MPaJIKdv757kold6gvICQzKA&s",
          link: "https://www.auxilo.com",
        },
        {
          title: "Credila Education Loan",
          description:
            "Credila Education Loans are offered by HDFC, providing financial assistance for a wide range of educational courses. Whether you're pursuing higher education in India or abroad, Credila offers competitive interest rates and flexible repayment terms. The loan covers all academic expenses, including tuition, books, and living costs. With quick approval and an easy application process, Credila is one of the leading choices for students looking for an education loan to fund their academic journey.",
          image: "https://www.searcheducation.com/img/hdfc-credila.png",
          link: "https://www.hdfccredila.com",
        },
      ],
    },
  ];


  return (
    <div className="min-h-screen pt-6 pb-10 px-8 bg-gradient-to-b from-gray-50 via-blue-100 to-white">
      <h1 className="text-4xl font-semibold text-center text-blue-900 mt-6 mb-6">
        Education Loans in India
      </h1>
      <p className="text-center max-w-4xl mx-auto mb-8 text-gray-700">
        Explore various education loans offered by government and private institutions in India to support your academic aspirations.
      </p>

      {loansData.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">{section.category}</h2>
          {section.loans.map((loan, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center lg:gap-10`}
            >
              {/* Image Section */}
              <div className="w-full lg:w-1/3 bg-white flex justify-center items-center h-64 rounded-lg shadow-lg overflow-hidden">
  <img
    src={loan.image}
    alt={loan.title || "Loan Image"} // Improved alt text for accessibility
    className="object-cover w-full h-full" // Use object-cover to ensure image covers the container
    loading="lazy" // Enable lazy loading for better performance
    aria-label={loan.title || "Loan Image"} // Provide more context to screen readers
  />
</div>


              {/* Description Section */}
              <div className="w-full lg:w-2/3 mt-6 lg:mt-0">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  {loan.title}
                </h3>
                <p className="text-gray-700 mb-4">{loan.description}</p>
                <a
                  href={loan.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Loans;
