import React from "react";

const Scholarships = () => {
  const scholarshipsData = [
    // Central Government Scholarships
    {
      category: "Central Government Scholarships",
      scholarships: [
        {
          title: "National Scholarship Portal (NSP)",
          description:
            "The NSP provides a wide range of scholarships for students across different levels of education, including pre-matric, post-matric, and merit-based scholarships for minorities and economically backward classes.",
          image: "https://media.assettype.com/freepressjournal/2024-09-03/96gkwh43/Untitled%20design%20-%202024-09-03T133356.082.jpg",
          link: "https://scholarships.gov.in",
        },
        {
          title: "PM Scholarship Scheme",
          description:
            "This scheme offers scholarships to the dependents of ex-servicemen and widows of Indian Armed Forces personnel for technical and professional education.",
          image: "https://www.successcds.net/wp-content/uploads/2023/09/PMSS-2023.jpeg",
          link: "https://www.desw.gov.in/scholarship",
        },
        {
          title: "AICTE Pragati Scholarship for Girls",
          description:
            "This scholarship is awarded to girl students pursuing technical education to help with tuition and academic expenses.",
          image: "https://bodmaseducation.com/wp-content/uploads/2024/11/scholarship.jpg",
          link: "https://www.aicte-india.org/schemes/students-development-schemes",
        },
        {
          title: "Central Sector Scholarship Scheme for College Students",
          description:
            "This scheme provides financial support to meritorious students from low-income families to meet day-to-day expenses during their undergraduate and postgraduate studies.",
          image: "https://d2w7l1p59qkl0r.cloudfront.net/article/wp-content/uploads/2023/04/05145550/Central-Sector-Scholarship-%E2%80%93-A-Scholarship-Scheme-for-College-and-University-Students.jpg",
          link: "https://scholarships.gov.in",
        },
      ],
    },
    // State Government Scholarships
    {
      category: "State Government Scholarships",
      scholarships: [
        {
          title: "Maharashtra Scholarship Scheme",
          description:
            "The state of Maharashtra offers various scholarships for economically backward students, including the Rajarshi Shahu Maharaj Scholarship and Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna for hostel fees.",
          image: "https://eduadvice.in/media/uploads/blog/Maharashtra-Scholarship-Maha-DBT.png",
          link: "https://mahadbtmahait.gov.in",
        },
        {
          title: "West Bengal Merit-cum-Means Scholarship",
          description:
            "This scheme provides financial aid to students from minority communities in West Bengal for pursuing higher education.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA_rPAl31T-vE8Tvxu1-ZBo-NN6ANuLb3WSw&s",
          link: "https://wbmdfcscholarship.gov.in",
        },
        {
          title: "Karnataka Vidyasiri Scholarship",
          description:
            "Vidyasiri is a popular scholarship scheme in Karnataka, offering support to SC/ST/OBC students pursuing higher education in recognized institutions.",
          image: "https://www.needsofpublic.in/wp-content/uploads/2023/12/vidyasiri-2023-1024x577.webp",
          link: "https://karepass.cgg.gov.in",
        },
        {
          title: "Kerala Post-Matric Scholarship",
          description:
            "Post-Matric Scholarship provided by the Kerala government offers financial assistance to students from minority communities pursuing post-secondary education.",
          image: "https://cdnblogdiscover.leverageedu.com/discover/wp-content/uploads/2023/09/computer-science-in-dubai.jpg",
          link: "https://dcescholarship.kerala.gov.in",
        },
      ],
    },
    // Private Scholarships
    {
      category: "Private Scholarships",
      scholarships: [
        {
          title: "Tata Trusts Scholarship",
          description:
            "Tata Trusts offers scholarships for undergraduate and postgraduate students in India, covering fields like engineering, medicine, law, and more.",
          image: "https://img.jagranjosh.com/imported/images/E/Articles/TTFsCvr.jpg",
          link: "https://www.tatatrusts.org",
        },
        {
          title: "Aditya Birla Scholarship",
          description:
            "This prestigious scholarship is awarded to the top students from institutions like IITs, IIMs, and other top law and business schools.",
          image: "https://i0.wp.com/scholarshipscholar.com/wp-content/uploads/2024/05/Sitaram-Jindal-scholarship-2024-_1_.webp",
          link: "https://www.adityabirla.com/scholarships",
        },
        {
          title: "Reliance Foundation Scholarships",
          description:
            "Reliance Foundation offers scholarships to meritorious students in India in fields such as engineering, technology, and business management.",
          image: "https://etstatic.tnn.in/thumb/msid-112585367,width-1280,height-720,resizemode-75/112585367.jpg",
          link: "https://www.reliancefoundation.org",
        },
        {
          title: "HDFC Educational Crisis Scholarship",
          description:
            "HDFC Bank provides financial assistance to students facing difficulties due to a family crisis or personal emergency, allowing them to continue their education without disruption.",
          image: "https://d2w7l1p59qkl0r.cloudfront.net/article/wp-content/uploads/2023/07/12115742/HDFC-Bank-Parivartans-ECSS-Programme-2024-25.jpg",
          link: "https://www.hdfcbank.com",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-6 pb-10 px-8 bg-gradient-to-b from-gray-50 via-blue-100 to-white">
      <h1 className="text-4xl font-semibold text-center text-blue-900 mt-6 mb-6">
        Scholarships in India
      </h1>
      <p className="text-center max-w-4xl mx-auto mb-8 text-gray-700">
        Explore various scholarships provided by central and state governments,
        as well as private organizations, to support students in achieving their academic goals.
      </p>

      {scholarshipsData.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">{section.category}</h2>
          {section.scholarships.map((scholarship, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center lg:gap-10`}
            >
              {/* Image Section */}
              <div className="w-full lg:w-1/3">
                <img
                  src={scholarship.image}
                  alt={scholarship.title}
                  className="rounded-lg shadow-lg object-cover w-full h-64"
                />
              </div>

              {/* Description Section */}
              <div className="w-full lg:w-2/3 mt-6 lg:mt-0">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  {scholarship.title}
                </h3>
                <p className="text-gray-700 mb-4">{scholarship.description}</p>
                <a
                  href={scholarship.link}
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

export default Scholarships;
