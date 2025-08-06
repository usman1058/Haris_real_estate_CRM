const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: "hashedpassword123", // store hashed in real apps
      image: "/uploads/admin-avatar.jpg",
      emailVerified: new Date(),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "admin@crm.com",
      password: "test1234",
      image: "/uploads/john-avatar.jpg",
      emailVerified: new Date(),
    },
  });
  // Dealers
  const dealers = await prisma.dealer.createMany({
    data: [
      { name: "Ali Khan", email: "ali.khan@estate.com", phone: "+92-300-1111111", location: "DHA Phase 5, Lahore" },
      { name: "Fatima Sheikh", email: "fatima.sheikh@estate.com", phone: "+92-300-2222222", location: "Gulberg III, Lahore" },
      { name: "Hassan Raza", email: "hassan.raza@estate.com", phone: "+92-301-3333333", location: "Bahria Town, Islamabad" },
      { name: "Sana Iqbal", email: "sana.iqbal@estate.com", phone: "+92-302-4444444", location: "Clifton, Karachi" },
      { name: "Omar Siddiqui", email: "omar.siddiqui@estate.com", phone: "+92-303-5555555", location: "E-11, Islamabad" },
      { name: "Nimra Khan", email: "nimra.khan@estate.com", phone: "+92-304-6666666", location: "Gulshan-e-Iqbal, Karachi" },
    ],
  })

  const dealerList = await prisma.dealer.findMany()

  // Inventories
  const inventoryData = [
    {
      title: "Luxury Villa in DHA Phase 5",
      type: "House",
      size: "1 Kanal",
      location: "DHA Phase 5, Lahore",
      price: 45000000,
      beds: 6,
      floors: 2,
      status: "Available",
      description: "Modern villa with pool, garden, and basement home theater.",
      features: JSON.stringify(["Swimming Pool", "Garden", "Parking", "Security"]),
      images: JSON.stringify(["/images/villa1.jpg", "/images/villa1b.jpg"]),
      dealerId: dealerList[0].id,
    },
    {
      title: "10 Marla Modern House",
      type: "House",
      size: "10 Marla",
      location: "Model Town, Lahore",
      price: 25000000,
      beds: 4,
      floors: 2,
      status: "Sold",
      description: "Fully furnished house with rooftop BBQ.",
      features: JSON.stringify(["Parking", "Security", "Rooftop"]),
      images: JSON.stringify(["/images/house1.jpg"]),
      dealerId: dealerList[1].id,
    },
    {
      title: "5 Marla Stylish Apartment",
      type: "Apartment",
      size: "5 Marla",
      location: "Johar Town, Lahore",
      price: 12000000,
      beds: 3,
      floors: 1,
      status: "Available",
      description: "Elegant apartment with lift and parking.",
      features: JSON.stringify(["Parking", "Security", "Balcony"]),
      images: JSON.stringify(["/images/apartment1.jpg"]),
      dealerId: dealerList[0].id,
    },
    {
      title: "2 Kanal Farmhouse",
      type: "House",
      size: "2 Kanal",
      location: "Bahria Town, Islamabad",
      price: 90000000,
      beds: 8,
      floors: 2,
      status: "Available",
      description: "Luxury farmhouse with pool and private garden.",
      features: JSON.stringify(["Swimming Pool", "Garden", "Security", "Parking"]),
      images: JSON.stringify(["/images/farmhouse1.jpg"]),
      dealerId: dealerList[2].id,
    },
    {
      title: "Oceanfront Apartment",
      type: "Apartment",
      size: "8 Marla",
      location: "Clifton, Karachi",
      price: 35000000,
      beds: 4,
      floors: 1,
      status: "Available",
      description: "Sea view apartment with modern interior.",
      features: JSON.stringify(["Sea View", "Parking", "Security"]),
      images: JSON.stringify(["/images/sea_apartment.jpg"]),
      dealerId: dealerList[3].id,
    },
    {
      title: "Commercial Plaza",
      type: "Commercial",
      size: "1 Kanal",
      location: "Gulberg III, Lahore",
      price: 150000000,
      beds: 0,
      floors: 5,
      status: "Available",
      description: "Prime location commercial plaza ideal for offices.",
      features: JSON.stringify(["Parking", "Security", "Elevator"]),
      images: JSON.stringify(["/images/plaza.jpg"]),
      dealerId: dealerList[1].id,
    },
    {
      title: "Residential Plot",
      type: "Plot",
      size: "10 Marla",
      location: "E-11, Islamabad",
      price: 20000000,
      beds: 0,
      floors: 0,
      status: "Available",
      description: "Ready for construction in a prime sector.",
      features: JSON.stringify(["Corner Plot"]),
      images: JSON.stringify([]),
      dealerId: dealerList[4].id,
    },
    {
      title: "Luxury Penthouse",
      type: "Apartment",
      size: "12 Marla",
      location: "Gulshan-e-Iqbal, Karachi",
      price: 60000000,
      beds: 5,
      floors: 2,
      status: "Pending",
      description: "Spacious penthouse with panoramic city view.",
      features: JSON.stringify(["Balcony", "Parking", "Security"]),
      images: JSON.stringify(["/images/penthouse.jpg"]),
      dealerId: dealerList[5].id,
    },
    {
      title: "Studio Apartment",
      type: "Apartment",
      size: "3 Marla",
      location: "DHA Phase 2, Islamabad",
      price: 8000000,
      beds: 1,
      floors: 1,
      status: "Available",
      description: "Compact and modern living space.",
      features: JSON.stringify(["Parking", "Security"]),
      images: JSON.stringify([]),
      dealerId: dealerList[2].id,
    },
    {
      title: "Townhouse",
      type: "House",
      size: "5 Marla",
      location: "Bahria Town, Lahore",
      price: 15000000,
      beds: 3,
      floors: 2,
      status: "Available",
      description: "Family-friendly townhouse near park.",
      features: JSON.stringify(["Parking", "Garden"]),
      images: JSON.stringify(["/images/townhouse.jpg"]),
      dealerId: dealerList[0].id,
    },
    {
      title: "Corporate Office Space",
      type: "Commercial",
      size: "15 Marla",
      location: "Blue Area, Islamabad",
      price: 90000000,
      beds: 0,
      floors: 4,
      status: "Available",
      description: "Furnished office space in the business hub.",
      features: JSON.stringify(["Parking", "Elevator", "Security"]),
      images: JSON.stringify(["/images/office.jpg"]),
      dealerId: dealerList[4].id,
    },
    {
      title: "Bungalow",
      type: "House",
      size: "1 Kanal",
      location: "Clifton, Karachi",
      price: 75000000,
      beds: 6,
      floors: 2,
      status: "Sold",
      description: "Elegant bungalow with garden and servant quarters.",
      features: JSON.stringify(["Parking", "Garden", "Security"]),
      images: JSON.stringify(["/images/bungalow.jpg"]),
      dealerId: dealerList[3].id,
    },
  ]

  await prisma.inventory.createMany({ data: inventoryData })

  // Demands
  await prisma.demand.createMany({
    data: [
      { size: "5 Marla", location: "DHA Phase 5, Lahore", budget: 16000000, type: "House", clientName: "Muhammad Ahmed", clientPhone: "+92-300-5555555" },
      { size: "10 Marla", location: "Model Town, Lahore", budget: 27000000, type: "Villa", clientName: "Zainab Fatima", clientPhone: "+92-301-4444444" },
      { size: "3 Marla", location: "Gulberg III, Lahore", budget: 9000000, type: "Apartment", clientName: "Hassan Ali", clientPhone: "+92-302-3333333" },
      { size: "1 Kanal", location: "Bahria Town, Islamabad", budget: 95000000, type: "House", clientName: "Imran Khan", clientPhone: "+92-303-7777777" },
      { size: "8 Marla", location: "Clifton, Karachi", budget: 37000000, type: "Apartment", clientName: "Sadia Rehman", clientPhone: "+92-304-8888888" },
      { size: "2 Kanal", location: "Bahria Town, Islamabad", budget: 88000000, type: "House", clientName: "Ahmed Raza", clientPhone: "+92-305-9999999" },
      { size: "12 Marla", location: "Gulshan-e-Iqbal, Karachi", budget: 62000000, type: "Apartment", clientName: "Bushra Malik", clientPhone: "+92-306-1212121" },
      { size: "15 Marla", location: "Blue Area, Islamabad", budget: 95000000, type: "Commercial", clientName: "Corporate Client", clientPhone: "+92-307-3434343" },
    ],
  })

  // Recent Activity
  await prisma.recentActivity.createMany({
    data: [
      { user: "Admin User", action: "Added Property", target: "Luxury Villa in DHA Phase 5", type: "Inventory" },
      { user: "Sarah Dealer", action: "Closed Deal", target: "10 Marla Modern House", type: "Sale" },
      { user: "Admin User", action: "Updated Demand", target: "Muhammad Ahmed", type: "Demand" },
      { user: "Omar Siddiqui", action: "Added Property", target: "Corporate Office Space", type: "Inventory" },
      { user: "Nimra Khan", action: "Price Update", target: "Luxury Penthouse", type: "Update" },
      { user: "Fatima Sheikh", action: "New Demand", target: "Sadia Rehman", type: "Demand" },
    ],
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
