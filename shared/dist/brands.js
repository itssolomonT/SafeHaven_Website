"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRANDS = void 0;
exports.getBrandByZipCode = getBrandByZipCode;
exports.getBrandById = getBrandById;
exports.getAllBrands = getAllBrands;
exports.BRANDS = [
    {
        id: 'safehaven-nc',
        name: 'SafeHaven NC',
        displayName: 'SafeHaven Security Systems',
        states: ['NC'],
        zipCodes: ['27000', '27001', '27002', '27003', '27004', '27005', '27006', '27007', '27008', '27009', '27010'],
        phoneNumber: '(919) 555-0123',
        website: 'https://safehaven-nc.com',
        colors: {
            primary: '#1e40af',
            secondary: '#3b82f6',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937'
        },
        logo: '/logos/safehaven-nc.svg',
        ctaText: 'Get Your Free Security Quote',
        ctaColor: '#1e40af',
        description: 'North Carolina\'s trusted home security provider. Protect your family with state-of-the-art technology and 24/7 monitoring.',
        features: [
            '24/7 Professional Monitoring',
            'Smart Home Integration',
            'Mobile App Control',
            'HD Video Surveillance',
            'Fire & Carbon Monoxide Protection'
        ],
        testimonials: [
            {
                id: '1',
                name: 'Sarah Johnson',
                location: 'Raleigh, NC',
                rating: 5,
                text: 'SafeHaven has given us peace of mind. The installation was quick and the system is easy to use.',
                date: '2024-01-15'
            },
            {
                id: '2',
                name: 'Mike Chen',
                location: 'Charlotte, NC',
                rating: 5,
                text: 'Excellent customer service and reliable monitoring. Highly recommend!',
                date: '2024-01-10'
            }
        ]
    },
    {
        id: 'safehaven-sc',
        name: 'SafeHaven SC',
        displayName: 'SafeHaven Security Systems',
        states: ['SC'],
        zipCodes: ['29000', '29001', '29002', '29003', '29004', '29005', '29006', '29007', '29008', '29009', '29010'],
        phoneNumber: '(803) 555-0123',
        website: 'https://safehaven-sc.com',
        colors: {
            primary: '#059669',
            secondary: '#10b981',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937'
        },
        logo: '/logos/safehaven-sc.svg',
        ctaText: 'Protect Your South Carolina Home',
        ctaColor: '#059669',
        description: 'South Carolina\'s premier security provider. Advanced technology meets southern hospitality.',
        features: [
            '24/7 Professional Monitoring',
            'Smart Home Integration',
            'Mobile App Control',
            'HD Video Surveillance',
            'Fire & Carbon Monoxide Protection'
        ],
        testimonials: [
            {
                id: '3',
                name: 'Lisa Thompson',
                location: 'Columbia, SC',
                rating: 5,
                text: 'The team at SafeHaven SC was professional and thorough. Our home feels much safer now.',
                date: '2024-01-12'
            }
        ]
    },
    {
        id: 'safehaven-tn',
        name: 'SafeHaven TN',
        displayName: 'SafeHaven Security Systems',
        states: ['TN'],
        zipCodes: ['37000', '37001', '37002', '37003', '37004', '37005', '37006', '37007', '37008', '37009', '37010'],
        phoneNumber: '(615) 555-0123',
        website: 'https://safehaven-tn.com',
        colors: {
            primary: '#7c3aed',
            secondary: '#8b5cf6',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937'
        },
        logo: '/logos/safehaven-tn.svg',
        ctaText: 'Secure Your Tennessee Home',
        ctaColor: '#7c3aed',
        description: 'Tennessee\'s trusted security partner. Protecting families across the Volunteer State.',
        features: [
            '24/7 Professional Monitoring',
            'Smart Home Integration',
            'Mobile App Control',
            'HD Video Surveillance',
            'Fire & Carbon Monoxide Protection'
        ],
        testimonials: [
            {
                id: '4',
                name: 'David Wilson',
                location: 'Nashville, TN',
                rating: 5,
                text: 'Outstanding service and reliable protection. SafeHaven TN exceeded our expectations.',
                date: '2024-01-08'
            }
        ]
    },
    {
        id: 'topsecurity',
        name: 'TopSecurity',
        displayName: 'TopSecurity Georgia',
        states: ['GA'],
        zipCodes: ['30000', '30001', '30002', '30003', '30004', '30005', '30006', '30007', '30008', '30009', '30010'],
        phoneNumber: '(404) 555-0123',
        website: 'https://topsecurity-ga.com',
        colors: {
            primary: '#dc2626',
            secondary: '#ef4444',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937'
        },
        logo: '/logos/topsecurity.svg',
        ctaText: 'Georgia\'s Top Security Choice',
        ctaColor: '#dc2626',
        description: 'Georgia\'s #1 security provider. Experience the difference that makes us TopSecurity.',
        features: [
            '24/7 Professional Monitoring',
            'Smart Home Integration',
            'Mobile App Control',
            'HD Video Surveillance',
            'Fire & Carbon Monoxide Protection'
        ],
        testimonials: [
            {
                id: '5',
                name: 'Jennifer Davis',
                location: 'Atlanta, GA',
                rating: 5,
                text: 'TopSecurity lives up to their name. Professional, reliable, and top-notch service.',
                date: '2024-01-14'
            }
        ]
    },
    {
        id: 'bestsecurity',
        name: 'BestSecurity',
        displayName: 'BestSecurity Florida',
        states: ['FL'],
        zipCodes: ['32000', '32001', '32002', '32003', '32004', '32005', '32006', '32007', '32008', '32009', '32010'],
        phoneNumber: '(305) 555-0123',
        website: 'https://bestsecurity-fl.com',
        colors: {
            primary: '#0891b2',
            secondary: '#06b6d4',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937'
        },
        logo: '/logos/bestsecurity.svg',
        ctaText: 'Florida\'s Best Security Solution',
        ctaColor: '#0891b2',
        description: 'Florida\'s best security provider. Protecting the Sunshine State with cutting-edge technology.',
        features: [
            '24/7 Professional Monitoring',
            'Smart Home Integration',
            'Mobile App Control',
            'HD Video Surveillance',
            'Fire & Carbon Monoxide Protection'
        ],
        testimonials: [
            {
                id: '6',
                name: 'Robert Martinez',
                location: 'Miami, FL',
                rating: 5,
                text: 'BestSecurity is truly the best. Great technology and even better customer service.',
                date: '2024-01-11'
            }
        ]
    },
    {
        id: 'redhawk',
        name: 'RedHawk Alarms',
        displayName: 'RedHawk Alarms Alabama',
        states: ['AL'],
        zipCodes: ['35000', '35001', '35002', '35003', '35004', '35005', '35006', '35007', '35008', '35009', '35010'],
        phoneNumber: '(205) 555-0123',
        website: 'https://redhawk-al.com',
        colors: {
            primary: '#991b1b',
            secondary: '#b91c1c',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937'
        },
        logo: '/logos/redhawk.svg',
        ctaText: 'Alabama\'s Premier Security',
        ctaColor: '#991b1b',
        description: 'Alabama\'s premier security provider. RedHawk Alarms - protecting what matters most.',
        features: [
            '24/7 Professional Monitoring',
            'Smart Home Integration',
            'Mobile App Control',
            'HD Video Surveillance',
            'Fire & Carbon Monoxide Protection'
        ],
        testimonials: [
            {
                id: '7',
                name: 'Amanda Foster',
                location: 'Birmingham, AL',
                rating: 5,
                text: 'RedHawk Alarms provides exceptional service. Our family feels safe and secure.',
                date: '2024-01-09'
            }
        ]
    }
];
function getBrandByZipCode(zipCode) {
    return exports.BRANDS.find(brand => brand.zipCodes.some(zip => zipCode.startsWith(zip.substring(0, 3)))) || null;
}
function getBrandById(brandId) {
    return exports.BRANDS.find(brand => brand.id === brandId) || null;
}
function getAllBrands() {
    return exports.BRANDS;
}
//# sourceMappingURL=brands.js.map