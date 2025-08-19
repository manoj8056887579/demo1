// Using built-in fetch API (Node.js 18+)

const servicesData = [
  {
    title: "Drafting & 3D Modeling",
    heading: "Professional CAD Drafting & 3D Modeling Services",
    shortDescription:
      "Precision technical drawings and detailed 3D models for complex engineering projects.",
    fullDescription:
      "Our comprehensive CAD services include technical drawings, 3D modeling, and design documentation for complex engineering projects. We use cutting-edge software and methodologies to deliver precise, manufacturable designs that meet industry standards and client specifications.",
    features: [
      "2D Technical Drawings",
      "3D Solid Modeling",
      "Assembly Design",
      "Design Documentation",
      "CAD Conversion",
      "Parametric Modeling",
    ],
    applications: [
      "Mechanical Components",
      "Industrial Equipment",
      "Product Design",
      "Manufacturing",
    ],
    technologies: ["AutoCAD", "SolidWorks", "Inventor", "Fusion 360"],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Requirements Analysis",
        description:
          "Understanding your project specifications and technical requirements",
      },
      {
        step: "02",
        title: "Concept Development",
        description: "Creating initial concepts and design alternatives",
      },
      {
        step: "03",
        title: "Detailed Modeling",
        description: "Developing precise 3D models and technical drawings",
      },
      {
        step: "04",
        title: "Review & Delivery",
        description: "Quality review and final delivery with documentation",
      },
    ],
    status: "active",
    featured: true,
    seoTitle:
      "Professional CAD Drafting & 3D Modeling Services | Filigree Solutions",
    seoDescription:
      "Expert CAD drafting and 3D modeling services for engineering projects. Precision technical drawings, solid modeling, and design documentation.",
    seoKeywords:
      "CAD drafting, 3D modeling, technical drawings, SolidWorks, AutoCAD, engineering design, mechanical design",
  },
  {
    title: "Structural Analysis",
    heading: "Advanced Structural Analysis & Design Services",
    shortDescription:
      "Comprehensive structural analysis and design solutions for buildings, bridges, and industrial structures.",
    fullDescription:
      "Our structural analysis services provide detailed evaluation of structural integrity, load-bearing capacity, and safety factors. We utilize advanced FEA software to analyze complex structures and provide optimized design solutions that meet international building codes and safety standards.",
    features: [
      "Static Analysis",
      "Dynamic Analysis",
      "Seismic Analysis",
      "Wind Load Analysis",
      "Foundation Design",
      "Steel Structure Design",
    ],
    applications: [
      "Commercial Buildings",
      "Residential Structures",
      "Industrial Facilities",
      "Bridges & Infrastructure",
    ],
    technologies: ["STAAD Pro", "ETABS", "SAP2000", "ANSYS Structural"],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Load Assessment",
        description: "Analyzing all applicable loads and load combinations",
      },
      {
        step: "02",
        title: "Structural Modeling",
        description:
          "Creating detailed structural models with boundary conditions",
      },
      {
        step: "03",
        title: "Analysis & Design",
        description: "Performing comprehensive analysis and member design",
      },
      {
        step: "04",
        title: "Report Generation",
        description: "Delivering detailed analysis reports and design drawings",
      },
    ],
    status: "active",
    featured: true,
    seoTitle: "Structural Analysis & Design Services | Filigree Solutions",
    seoDescription:
      "Professional structural analysis and design services using STAAD Pro, ETABS, and SAP2000. Expert structural engineering solutions for all building types.",
    seoKeywords:
      "structural analysis, structural design, STAAD Pro, ETABS, SAP2000, building design, structural engineering",
  },
  {
    title: "Dynamic & Fatigue Analysis",
    heading: "Dynamic Analysis & Fatigue Life Assessment",
    shortDescription:
      "Advanced dynamic analysis and fatigue life prediction for mechanical components and structures.",
    fullDescription:
      "Our dynamic and fatigue analysis services help predict component life, identify potential failure modes, and optimize designs for long-term reliability. We use sophisticated simulation tools to analyze vibration, resonance, and fatigue behavior under various loading conditions.",
    features: [
      "Modal Analysis",
      "Harmonic Response",
      "Transient Analysis",
      "Fatigue Life Prediction",
      "Vibration Analysis",
      "Resonance Studies",
    ],
    applications: [
      "Automotive Components",
      "Aerospace Structures",
      "Industrial Machinery",
      "Rotating Equipment",
    ],
    technologies: [
      "ANSYS Mechanical",
      "Abaqus",
      "MSC Nastran",
      "nCode DesignLife",
    ],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Dynamic Characterization",
        description: "Identifying natural frequencies and mode shapes",
      },
      {
        step: "02",
        title: "Loading Definition",
        description: "Defining dynamic loads and operating conditions",
      },
      {
        step: "03",
        title: "Fatigue Analysis",
        description: "Calculating stress cycles and fatigue life",
      },
      {
        step: "04",
        title: "Optimization",
        description: "Recommending design improvements for enhanced durability",
      },
    ],
    status: "active",
    featured: false,
    seoTitle: "Dynamic & Fatigue Analysis Services | Filigree Solutions",
    seoDescription:
      "Expert dynamic analysis and fatigue life assessment using ANSYS, Abaqus, and MSC Nastran. Predict component life and optimize designs for reliability.",
    seoKeywords:
      "dynamic analysis, fatigue analysis, modal analysis, vibration analysis, ANSYS, Abaqus, component life prediction",
  },
  {
    title: "GD&T Application",
    heading: "Geometric Dimensioning & Tolerancing Services",
    shortDescription:
      "Professional GD&T application and tolerance analysis for precision manufacturing.",
    fullDescription:
      "Our GD&T services ensure proper geometric dimensioning and tolerancing according to ASME Y14.5 and ISO standards. We provide comprehensive tolerance analysis, stack-up studies, and manufacturing-friendly design solutions that reduce production costs and improve quality.",
    features: [
      "GD&T Symbol Application",
      "Tolerance Stack-up Analysis",
      "Statistical Tolerance Analysis",
      "Datum Reference Frames",
      "Form & Position Tolerances",
      "Manufacturing Feasibility",
    ],
    applications: [
      "Precision Machining",
      "Automotive Parts",
      "Aerospace Components",
      "Medical Devices",
    ],
    technologies: [
      "CETOL 6σ",
      "3DCS Variation Analyst",
      "Sigmund",
      "GD&T Advisor",
    ],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Design Review",
        description: "Analyzing design intent and functional requirements",
      },
      {
        step: "02",
        title: "GD&T Application",
        description: "Applying appropriate geometric tolerances and datums",
      },
      {
        step: "03",
        title: "Tolerance Analysis",
        description: "Performing stack-up and statistical tolerance analysis",
      },
      {
        step: "04",
        title: "Documentation",
        description: "Creating detailed GD&T drawings and inspection plans",
      },
    ],
    status: "active",
    featured: false,
    seoTitle:
      "GD&T Application & Tolerance Analysis Services | Filigree Solutions",
    seoDescription:
      "Professional GD&T application and tolerance analysis services. Expert geometric dimensioning and tolerancing per ASME Y14.5 standards.",
    seoKeywords:
      "GD&T, geometric dimensioning tolerancing, tolerance analysis, ASME Y14.5, precision manufacturing, tolerance stack-up",
  },
  {
    title: "EV Component Simulation",
    heading: "Electric Vehicle Component Analysis & Simulation",
    shortDescription:
      "Specialized simulation services for electric vehicle components including batteries, motors, and thermal systems.",
    fullDescription:
      "Our EV component simulation services cover the complete range of electric vehicle systems including battery thermal management, electric motor analysis, power electronics cooling, and structural integrity of EV chassis. We help optimize performance, safety, and efficiency of electric vehicle components.",
    features: [
      "Battery Thermal Analysis",
      "Electric Motor Simulation",
      "Power Electronics Cooling",
      "Crash Safety Analysis",
      "Electromagnetic Analysis",
      "Thermal Management",
    ],
    applications: [
      "Battery Packs",
      "Electric Motors",
      "Charging Systems",
      "EV Chassis",
    ],
    technologies: [
      "ANSYS Fluent",
      "ANSYS Maxwell",
      "COMSOL Multiphysics",
      "AVL FIRE",
    ],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "System Analysis",
        description:
          "Understanding EV component requirements and operating conditions",
      },
      {
        step: "02",
        title: "Multi-physics Modeling",
        description: "Creating coupled thermal-electrical-mechanical models",
      },
      {
        step: "03",
        title: "Performance Simulation",
        description: "Analyzing performance under various operating scenarios",
      },
      {
        step: "04",
        title: "Optimization",
        description:
          "Optimizing design for efficiency, safety, and performance",
      },
    ],
    status: "active",
    featured: true,
    seoTitle:
      "EV Component Simulation & Analysis Services | Filigree Solutions",
    seoDescription:
      "Specialized electric vehicle component simulation services. Battery thermal analysis, motor simulation, and EV system optimization using advanced CFD and FEA tools.",
    seoKeywords:
      "EV simulation, electric vehicle analysis, battery thermal management, electric motor simulation, EV component design",
  },
  {
    title: "Telecom Tower Analysis",
    heading: "Telecom Tower Structural Analysis & Design",
    shortDescription:
      "Comprehensive structural analysis and design services for telecom towers and communication structures.",
    fullDescription:
      "Our telecom tower analysis services provide complete structural evaluation including wind load analysis, seismic assessment, foundation design, and antenna loading studies. We ensure compliance with TIA-222 standards and local building codes for safe and reliable communication infrastructure.",
    features: [
      "Wind Load Analysis",
      "Seismic Analysis",
      "Foundation Design",
      "Antenna Load Studies",
      "Tower Modification Analysis",
      "Structural Health Monitoring",
    ],
    applications: [
      "Cell Phone Towers",
      "Broadcast Towers",
      "Microwave Towers",
      "Communication Masts",
    ],
    technologies: ["RISA-3D", "Tower", "STAAD Pro", "ANSYS Structural"],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Site Assessment",
        description: "Evaluating site conditions and environmental factors",
      },
      {
        step: "02",
        title: "Load Calculation",
        description:
          "Calculating wind, seismic, and equipment loads per TIA-222",
      },
      {
        step: "03",
        title: "Structural Analysis",
        description:
          "Performing detailed structural analysis and member design",
      },
      {
        step: "04",
        title: "Certification",
        description:
          "Providing structural certification and compliance documentation",
      },
    ],
    status: "active",
    featured: false,
    seoTitle: "Telecom Tower Analysis & Design Services | Filigree Solutions",
    seoDescription:
      "Professional telecom tower structural analysis and design services. TIA-222 compliant wind load analysis, seismic assessment, and foundation design.",
    seoKeywords:
      "telecom tower analysis, tower design, TIA-222, wind load analysis, communication tower, structural analysis",
  },
  {
    title: "CFD Analysis",
    heading: "Computational Fluid Dynamics Analysis Services",
    shortDescription:
      "Advanced CFD analysis for fluid flow, heat transfer, and aerodynamic optimization.",
    fullDescription:
      "Our CFD analysis services provide detailed insights into fluid behavior, heat transfer characteristics, and aerodynamic performance. We use industry-leading CFD software to solve complex fluid dynamics problems and optimize designs for improved performance and efficiency.",
    features: [
      "Flow Analysis",
      "Heat Transfer Analysis",
      "Turbulence Modeling",
      "Multiphase Flow",
      "Aerodynamic Analysis",
      "Thermal Management",
    ],
    applications: [
      "HVAC Systems",
      "Automotive Aerodynamics",
      "Industrial Processes",
      "Heat Exchangers",
    ],
    technologies: ["ANSYS Fluent", "ANSYS CFX", "OpenFOAM", "COMSOL CFD"],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Problem Definition",
        description: "Defining fluid domain and boundary conditions",
      },
      {
        step: "02",
        title: "Mesh Generation",
        description: "Creating high-quality computational mesh",
      },
      {
        step: "03",
        title: "Simulation Setup",
        description: "Configuring solver settings and physics models",
      },
      {
        step: "04",
        title: "Results Analysis",
        description: "Post-processing and interpreting simulation results",
      },
    ],
    status: "active",
    featured: false,
    seoTitle:
      "CFD Analysis Services | Computational Fluid Dynamics | Filigree Solutions",
    seoDescription:
      "Professional CFD analysis services using ANSYS Fluent and CFX. Expert fluid flow, heat transfer, and aerodynamic analysis for engineering applications.",
    seoKeywords:
      "CFD analysis, computational fluid dynamics, ANSYS Fluent, heat transfer analysis, aerodynamic analysis, fluid flow simulation",
  },
  {
    title: "FEA Consulting",
    heading: "Finite Element Analysis Consulting Services",
    shortDescription:
      "Expert FEA consulting for structural, thermal, and multiphysics simulations.",
    fullDescription:
      "Our FEA consulting services provide expert guidance and analysis for complex engineering problems. We offer comprehensive finite element analysis solutions including linear and nonlinear analysis, contact mechanics, material modeling, and optimization studies.",
    features: [
      "Linear & Nonlinear Analysis",
      "Contact Mechanics",
      "Material Modeling",
      "Buckling Analysis",
      "Optimization Studies",
      "Failure Analysis",
    ],
    applications: [
      "Mechanical Components",
      "Pressure Vessels",
      "Automotive Parts",
      "Aerospace Structures",
    ],
    technologies: [
      "ANSYS Mechanical",
      "Abaqus",
      "MSC Nastran",
      "Altair OptiStruct",
    ],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Problem Assessment",
        description: "Understanding analysis requirements and objectives",
      },
      {
        step: "02",
        title: "Model Development",
        description:
          "Creating appropriate FE models with proper boundary conditions",
      },
      {
        step: "03",
        title: "Analysis Execution",
        description: "Running simulations with appropriate solver settings",
      },
      {
        step: "04",
        title: "Results Interpretation",
        description: "Analyzing results and providing engineering insights",
      },
    ],
    status: "active",
    featured: false,
    seoTitle:
      "FEA Consulting Services | Finite Element Analysis | Filigree Solutions",
    seoDescription:
      "Expert FEA consulting services using ANSYS, Abaqus, and MSC Nastran. Professional finite element analysis for structural, thermal, and multiphysics simulations.",
    seoKeywords:
      "FEA consulting, finite element analysis, ANSYS Mechanical, Abaqus, structural analysis, simulation services",
  },
  {
    title: "Product Design",
    heading: "Innovative Product Design & Development Services",
    shortDescription:
      "Complete product design and development from concept to manufacturing-ready designs.",
    fullDescription:
      "Our product design services cover the entire product development lifecycle from initial concept sketches to manufacturing-ready designs. We combine creativity with engineering expertise to develop innovative, functional, and manufacturable products that meet market requirements.",
    features: [
      "Concept Design",
      "Industrial Design",
      "Prototyping",
      "Design for Manufacturing",
      "Material Selection",
      "Design Optimization",
    ],
    applications: [
      "Consumer Products",
      "Industrial Equipment",
      "Medical Devices",
      "Electronic Enclosures",
    ],
    technologies: ["SolidWorks", "Keyshot", "Fusion 360", "Rhino 3D"],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Concept Development",
        description: "Brainstorming and developing initial product concepts",
      },
      {
        step: "02",
        title: "Design Refinement",
        description: "Refining designs based on requirements and constraints",
      },
      {
        step: "03",
        title: "Prototyping",
        description: "Creating physical or virtual prototypes for validation",
      },
      {
        step: "04",
        title: "Design Finalization",
        description: "Finalizing designs for manufacturing and production",
      },
    ],
    status: "active",
    featured: false,
    seoTitle: "Product Design & Development Services | Filigree Solutions",
    seoDescription:
      "Professional product design and development services from concept to manufacturing. Industrial design, prototyping, and design optimization solutions.",
    seoKeywords:
      "product design, product development, industrial design, prototyping, design for manufacturing, concept design",
  },
  {
    title: "Reverse Engineering",
    heading: "Precision Reverse Engineering Services",
    shortDescription:
      "Accurate reverse engineering and 3D reconstruction of existing parts and assemblies.",
    fullDescription:
      "Our reverse engineering services help recreate accurate 3D models from existing physical parts, legacy components, or damaged equipment. We use advanced 3D scanning technology and CAD modeling techniques to deliver precise digital representations for manufacturing, modification, or analysis purposes.",
    features: [
      "3D Scanning",
      "Point Cloud Processing",
      "Surface Reconstruction",
      "CAD Model Creation",
      "Dimensional Analysis",
      "Quality Inspection",
    ],
    applications: [
      "Legacy Parts",
      "Damaged Components",
      "Competitive Analysis",
      "Design Improvement",
    ],
    technologies: [
      "3D Scanners",
      "Geomagic Design X",
      "SolidWorks",
      "Polyworks",
    ],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "3D Scanning",
        description:
          "Capturing accurate 3D geometry using advanced scanning technology",
      },
      {
        step: "02",
        title: "Data Processing",
        description: "Processing point cloud data and creating mesh models",
      },
      {
        step: "03",
        title: "CAD Reconstruction",
        description: "Creating parametric CAD models from scan data",
      },
      {
        step: "04",
        title: "Validation",
        description: "Validating accuracy and delivering final CAD models",
      },
    ],
    status: "active",
    featured: false,
    seoTitle:
      "Reverse Engineering Services | 3D Scanning & CAD Reconstruction | Filigree Solutions",
    seoDescription:
      "Professional reverse engineering services using 3D scanning and CAD reconstruction. Accurate digital recreation of existing parts and assemblies.",
    seoKeywords:
      "reverse engineering, 3D scanning, CAD reconstruction, point cloud processing, legacy parts, dimensional analysis",
  },
  {
    title: "Piping Design",
    heading: "Industrial Piping Design & Analysis Services",
    shortDescription:
      "Comprehensive piping design and stress analysis for industrial and process plants.",
    fullDescription:
      "Our piping design services provide complete solutions for industrial piping systems including layout design, stress analysis, support design, and compliance with international codes. We ensure safe, efficient, and cost-effective piping solutions for various industrial applications.",
    features: [
      "Piping Layout Design",
      "Stress Analysis",
      "Support Design",
      "Isometric Drawings",
      "Material Selection",
      "Code Compliance",
    ],
    applications: [
      "Oil & Gas Plants",
      "Chemical Processing",
      "Power Plants",
      "Water Treatment",
    ],
    technologies: ["PDMS", "AutoCAD Plant 3D", "CAESAR II", "STAAD Pro"],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Design Basis",
        description: "Establishing design criteria and code requirements",
      },
      {
        step: "02",
        title: "Layout Design",
        description: "Creating optimal piping layouts and routing",
      },
      {
        step: "03",
        title: "Stress Analysis",
        description: "Performing piping stress analysis and support design",
      },
      {
        step: "04",
        title: "Documentation",
        description: "Generating isometric drawings and material lists",
      },
    ],
    status: "active",
    featured: false,
    seoTitle: "Piping Design & Stress Analysis Services | Filigree Solutions",
    seoDescription:
      "Professional piping design and stress analysis services using PDMS, CAESAR II, and AutoCAD Plant 3D. Industrial piping solutions for process plants.",
    seoKeywords:
      "piping design, piping stress analysis, CAESAR II, PDMS, industrial piping, process plant design",
  },
  {
    title: "Mechanical Design",
    heading: "Comprehensive Mechanical Design Services",
    shortDescription:
      "Complete mechanical design solutions for machinery, equipment, and mechanical systems.",
    fullDescription:
      "Our mechanical design services encompass the complete design and development of mechanical systems, machinery, and equipment. We provide innovative solutions that combine functionality, reliability, and cost-effectiveness while meeting industry standards and customer requirements.",
    features: [
      "Machine Design",
      "Mechanism Design",
      "Component Selection",
      "Design Calculations",
      "Performance Analysis",
      "Design Validation",
    ],
    applications: [
      "Industrial Machinery",
      "Automation Equipment",
      "Material Handling",
      "Manufacturing Tools",
    ],
    technologies: ["SolidWorks", "Inventor", "ANSYS", "MathCAD"],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Requirements Analysis",
        description: "Understanding functional and performance requirements",
      },
      {
        step: "02",
        title: "Conceptual Design",
        description:
          "Developing design concepts and selecting optimal solutions",
      },
      {
        step: "03",
        title: "Detailed Design",
        description: "Creating detailed mechanical designs and specifications",
      },
      {
        step: "04",
        title: "Design Verification",
        description: "Validating designs through analysis and testing",
      },
    ],
    status: "active",
    featured: false,
    seoTitle:
      "Mechanical Design Services | Machine Design | Filigree Solutions",
    seoDescription:
      "Professional mechanical design services for machinery and equipment. Complete mechanical design solutions from concept to manufacturing.",
    seoKeywords:
      "mechanical design, machine design, mechanical engineering, equipment design, machinery design, mechanical systems",
  },
  {
    title: "Mold Design",
    heading: "Precision Mold Design & Tooling Services",
    shortDescription:
      "Expert mold design and tooling solutions for injection molding and manufacturing processes.",
    fullDescription:
      "Our mold design services provide comprehensive solutions for injection molding, die casting, and other manufacturing processes. We design efficient, durable molds that ensure high-quality parts production while minimizing cycle times and manufacturing costs.",
    features: [
      "Injection Mold Design",
      "Die Design",
      "Mold Flow Analysis",
      "Cooling System Design",
      "Ejection System Design",
      "Tooling Optimization",
    ],
    applications: [
      "Plastic Parts",
      "Die Casting",
      "Rubber Molding",
      "Composite Parts",
    ],
    technologies: ["SolidWorks", "Moldflow", "UG NX", "Pro/Engineer"],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Part Analysis",
        description: "Analyzing part geometry and material requirements",
      },
      {
        step: "02",
        title: "Mold Concept",
        description: "Developing mold concepts and parting line strategies",
      },
      {
        step: "03",
        title: "Detailed Design",
        description: "Creating detailed mold designs with all components",
      },
      {
        step: "04",
        title: "Flow Analysis",
        description: "Performing mold flow analysis and optimization",
      },
    ],
    status: "active",
    featured: false,
    seoTitle:
      "Mold Design & Tooling Services | Injection Mold Design | Filigree Solutions",
    seoDescription:
      "Professional mold design and tooling services for injection molding. Expert mold flow analysis and tooling optimization for manufacturing efficiency.",
    seoKeywords:
      "mold design, injection mold design, tooling design, mold flow analysis, die design, manufacturing tooling",
  },
  {
    title: "Sheet Metal Design",
    heading: "Advanced Sheet Metal Design & Fabrication Services",
    shortDescription:
      "Specialized sheet metal design and development for manufacturing and fabrication processes.",
    fullDescription:
      "Our sheet metal design services provide optimized solutions for sheet metal components and assemblies. We focus on manufacturability, cost-effectiveness, and design for fabrication while ensuring structural integrity and functional requirements are met.",
    features: [
      "Sheet Metal Modeling",
      "Bend Analysis",
      "Flat Pattern Development",
      "Weldment Design",
      "Fabrication Drawings",
      "Cost Optimization",
    ],
    applications: [
      "Enclosures & Cabinets",
      "Automotive Panels",
      "HVAC Components",
      "Industrial Equipment",
    ],
    technologies: [
      "SolidWorks Sheet Metal",
      "Inventor Sheet Metal",
      "AutoCAD",
      "Bend-Tech",
    ],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Design Requirements",
        description: "Understanding functional and manufacturing requirements",
      },
      {
        step: "02",
        title: "Sheet Metal Modeling",
        description:
          "Creating parametric sheet metal models with bend features",
      },
      {
        step: "03",
        title: "Manufacturability Review",
        description: "Optimizing design for fabrication and cost-effectiveness",
      },
      {
        step: "04",
        title: "Documentation",
        description: "Generating fabrication drawings and flat patterns",
      },
    ],
    status: "active",
    featured: false,
    seoTitle:
      "Sheet Metal Design Services | Fabrication Design | Filigree Solutions",
    seoDescription:
      "Professional sheet metal design services for manufacturing and fabrication. Expert sheet metal modeling, bend analysis, and fabrication optimization.",
    seoKeywords:
      "sheet metal design, fabrication design, sheet metal modeling, bend analysis, manufacturing design, metal fabrication",
  },
  {
    title: "Simulation Services",
    heading: "Advanced Engineering Simulation & Analysis",
    shortDescription:
      "Comprehensive simulation services covering structural, thermal, fluid, and multiphysics analysis.",
    fullDescription:
      "Our simulation services provide comprehensive engineering analysis solutions using advanced CAE tools. We offer multi-disciplinary simulation capabilities including structural, thermal, fluid dynamics, and electromagnetic analysis to optimize designs and predict performance.",
    features: [
      "Multi-physics Simulation",
      "Optimization Studies",
      "Design Validation",
      "Performance Prediction",
      "Failure Analysis",
      "Parameter Studies",
    ],
    applications: [
      "Product Development",
      "Design Optimization",
      "Performance Analysis",
      "Failure Investigation",
    ],
    technologies: [
      "ANSYS Workbench",
      "COMSOL Multiphysics",
      "Altair HyperWorks",
      "MSC Software",
    ],
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    process: [
      {
        step: "01",
        title: "Problem Definition",
        description: "Defining simulation objectives and analysis requirements",
      },
      {
        step: "02",
        title: "Model Setup",
        description:
          "Creating appropriate simulation models and boundary conditions",
      },
      {
        step: "03",
        title: "Analysis Execution",
        description: "Running simulations with validated solution parameters",
      },
      {
        step: "04",
        title: "Results Validation",
        description:
          "Validating results and providing engineering recommendations",
      },
    ],
    status: "active",
    featured: false,
    seoTitle:
      "Engineering Simulation Services | CAE Analysis | Filigree Solutions",
    seoDescription:
      "Comprehensive engineering simulation services using ANSYS, COMSOL, and advanced CAE tools. Multi-physics analysis and design optimization solutions.",
    seoKeywords:
      "engineering simulation, CAE analysis, multi-physics simulation, ANSYS, COMSOL, design optimization, simulation services",
  },
];

async function pushAllServicesData() {
  try {
    console.log("🚀 Pushing 15 services to database...");
    console.log("📊 Total services to add:", servicesData.length);

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < servicesData.length; i++) {
      const service = servicesData[i];

      try {
        console.log(
          `\n📝 Adding service ${i + 1}/${servicesData.length}: ${
            service.title
          }`
        );

        const response = await fetch(
          "http://localhost:3000/api/admin/services",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(service),
          }
        );

        const result = await response.json();

        if (result.success) {
          console.log(`✅ Service "${service.title}" added successfully!`);
          console.log(`🆔 Service ID: ${result.data._id}`);
          successCount++;
        } else {
          console.error(`❌ Failed to add "${service.title}":`, result.message);
          failureCount++;
        }

        // Add small delay between requests to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Error adding "${service.title}":`, error.message);
        failureCount++;
      }
    }

    console.log("\n🎉 Batch operation completed!");
    console.log(`✅ Successfully added: ${successCount} services`);
    console.log(`❌ Failed to add: ${failureCount} services`);
    console.log(`📊 Total processed: ${successCount + failureCount} services`);

    if (failureCount > 0) {
      console.log(
        "💡 Some services failed to add. Check the error messages above."
      );
    }
  } catch (error) {
    console.error("❌ Error in batch operation:", error.message);
    console.log(
      "💡 Make sure your Next.js server is running on http://localhost:3000"
    );
  }
}

// Run the function
pushAllServicesData();
