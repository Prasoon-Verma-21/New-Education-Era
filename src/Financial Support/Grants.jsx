import React from "react";

const Grants = () => {
  const grantsData = [
    {
      category: "Government Grants",
      grants: [
        {
          title: "National Research Development Corporation (NRDC) Grants",
          description:
            "NRDC provides grants for innovative projects in science and technology, encouraging researchers and entrepreneurs to bring their ideas to life.",
          image: "https://nrdcindia.com/frontend/images/1549520589logo.png",
          link: "http://www.nrdcindia.com",
        },
        {
          title: "Technology Development Board (TDB) Grant",
          description:
            "TDB offers financial assistance to Indian industries and entrepreneurs for developing and commercializing indigenous technologies.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOMRwTkQX_HkEIWHBwzm_nsehErMLjegg-Jg&s",
          link: "http://www.tdb.gov.in",
        },
        {
          title: "Department of Science and Technology (DST) Innovation Grants",
          description:
            "DST provides grants to support research and innovation in various scientific fields, with a focus on promoting entrepreneurship and R&D activities in India.",
          image: "https://contentstatic.techgig.com/photo/101347931/dst-invites-applications-for-woman-scientist-dst-project-check-eligibility-last-date-and-more.jpg?103816",
          link: "https://dst.gov.in",
        },
        {
          title: "PMEGP (Prime Minister’s Employment Generation Programme)",
          description:
            "This grant is aimed at creating employment opportunities in rural and urban areas through self-employment ventures, supported by the Government of India.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtThlR59EuQZL90Ve9olmKHiRbW317_1vw0g&s",
          link: "https://www.kviconline.gov.in",
        },
      ],
    },
    {
      category: "Private Organization Grants",
      grants: [
        {
          title: "Tata Trusts Research Grants",
          description:
            "Tata Trusts provides grants for research projects in fields such as healthcare, technology, education, and rural development.",
          image: "https://www.opindia.com/wp-content/uploads/2024/10/Rata-Tata-successor-Tata-Trust.jpg",
          link: "https://www.tatatrusts.org",
        },
        {
          title: "Ford Foundation India Grants",
          description:
            "Ford Foundation supports organizations and individuals working towards social justice, education, and sustainable development in India.",
          image: "https://i0.wp.com/www.opindia.com/wp-content/uploads/2021/09/D8E1D0A2-5947-4361-A87C-11C62E0687B3.png?resize=696%2C378&ssl=1",
          link: "https://www.fordfoundation.org",
        },
        {
          title: "Azim Premji Foundation Grants",
          description:
            "Azim Premji Foundation provides grants for educational projects aimed at improving primary and secondary education in rural India.",
          image: "https://devinfo.in/wp-content/uploads/2021/08/logo.jpg",
          link: "https://azimpremjifoundation.org",
        },
        {
          title: "Infosys Foundation Grants",
          description:
            "Infosys Foundation offers grants to support initiatives in education, healthcare, rural development, and the arts in India.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmIfpoDi1t7BXekuYcujGPh6SfK1htKSjnjQ&s",
          link: "https://www.infosys.com/infosys-foundation",
        },
      ],
    },
    {
      category: "Educational and Research Grants",
      grants: [
        {
          title: "Fulbright-Nehru Research Grants",
          description:
            "These grants support Indian researchers and scholars in pursuing educational projects in the U.S. and fostering academic exchanges between the two countries.",
          image: "https://pharmabharat.org/wp-content/uploads/2024/10/Fulbright-Nehru-Fellowships-for-Indian-Citizens.webp",
          link: "https://www.usief.org.in/Fulbright-Nehru-Grants.aspx",
        },
        {
          title: "Wellcome Trust India Alliance Grants",
          description:
            "The Wellcome Trust provides grants to researchers in biomedical science, healthcare, and related fields, aimed at improving public health in India.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbV8fNxYPfb_ylQ-dSG6zzOKBrQA9RC-YfFA&s",
          link: "https://www.indiaalliance.org",
        },
        {
          title: "DBT-Research Grant (Department of Biotechnology)",
          description:
            "The DBT provides grants to promote research and development in biotechnology and its applications, focusing on healthcare, agriculture, and environmental sustainability.",
          image: "https://www.dbtctep.gov.in/ctepImages/gov-logo.png",
          link: "https://dbtindia.gov.in",
        },
        {
          title: "ICMR (Indian Council of Medical Research) Research Grants",
          description:
            "ICMR provides grants to support biomedical research projects, focusing on enhancing healthcare services and innovations in India.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgXDE40SRYvCJ0TfuwtBYdqsxg2cfFwOSHPA&s",
          link: "https://www.icmr.gov.in",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-6 pb-10 px-8 bg-gradient-to-b from-gray-50 via-blue-100 to-white">
      <h1 className="text-4xl font-semibold text-center text-blue-900 mt-6 mb-6">
        Grants in India
      </h1>
      <p className="text-center max-w-4xl mx-auto mb-8 text-gray-700">
        Explore various grants offered by government and private organizations in India, providing financial
        assistance for research, entrepreneurship, education, and community development.
      </p>

      {grantsData.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">{section.category}</h2>
          {section.grants.map((grant, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center lg:gap-10`}
            >
              {/* Image Section */}
              <div className="w-full lg:w-1/3 bg-white flex justify-center items-center h-64 rounded-lg shadow-lg">
  <img
    src={grant.image}
    alt={grant.title}
    className="object-contain w-full h-full"
  />
</div>


              {/* Description Section */}
              <div className="w-full lg:w-2/3 mt-6 lg:mt-0">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  {grant.title}
                </h3>
                <p className="text-gray-700 mb-4">{grant.description}</p>
                <a
                  href={grant.link}
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

export default Grants;
