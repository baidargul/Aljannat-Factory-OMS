import { v4 } from "uuid";
import prisma from "./prisma";

export async function setInitialDatabaseData() {

    const cityNames = [
        "ABDUL HAKIM /TULAMBA",
        "ABOTTABAD",
        "AHMED PUR EAST",
        "ALI PUR",
        "ALI PUR CHATTA",
        "ARIF WALA",
        "ATTOCK",
        "BADIN",
        "BAGH (AJK)",
        "BANU",
        "BAT KHELA",
        "BAWALNAGAR",
        "BHAI PHERU",
        "BHAKKAR",
        "BHALWAL",
        "BHAWALPUR",
        "BUREWALA",
        "CHAKWAL",
        "CHAMAN",
        "CHARSADA",
        "CHICHAWATNI",
        "CHINNIOT",
        "CHISTIAN",
        "CHITRAL",
        "D.G. KHAN",
        "D.I. KHAN",
        "DADU",
        "DADYAL (AJK)",
        "DARA ADAM KHEL",
        "DARGAI",
        "DASKA",
        "DAUD KHEL",
        "DEHARKI",
        "DEPALPUR",
        "DERA ALLAH YAR",
        "DERA MURAD JAMALI",
        "DINA",
        "DIR",
        "DUKI",
        "DUNYA PUR",
        "FAISALABAD",
        "FATEH JANG",
        "FORT ABBAS",
        "GADON",
        "GAMBAT",
        "GARHI YASEEN",
        "GHAZI",
        "GHOTKI",
        "GILGIT",
        "GOJRA",
        "GUDDU",
        "GUJAR KHAN",
        "GUJRANWALA",
        "GUJRAT",
        "GWADAR",
        "HAFIZABAD",
        "HALA",
        "HARI PUR",
        "HAROON ABAD",
        "HASIL PUR",
        "HASSAN ABDAL",
        "HATTAR",
        "HAVELIAN",
        "HUB",
        "HYDERABAD",
        "ISLAMABAD",
        "ISSA KHEL",
        "JACOB ABAD",
        "JAHANIAN",
        "JALALPUR JATTAN",
        "JAM PUR",
        "JARANWALA",
        "JEHLUM",
        "JHANG",
        "JHAT PAT",
        "JOHARABAD",
        "KABIR WALA",
        "KAHROR PACCA",
        "KALAT",
        "KAMALIA",
        "KAMBER ALI KHAN",
        "KAMOKE",
        "KAMRA",
        "KANDH KOT",
        "KANDIARO",
        "KARACHI",
        "KARAK",
        "KASHMORE",
        "KASUR",
        "KHAIRPUR",
        "KHAIRPUR NATHAN SHAH",
        "KHANEWAL",
        "KHANPUR",
        "KHARIAN",
        "KHIPRO",
        "KHURIAN WALA",
        "KHUSHAB",
        "KHUZDAR",
        "KILLA SAIFULLAH",
        "KOHAT",
        "KOT ADDU",
        "KOTLI (AJK)",
        "LAHORE",
        "LALA MUSA",
        "LALIAN",
        "LARKANA",
        "LAYYAH",
        "LIAQATPUR",
        "LODHRAN",
        "MAILSI",
        "MAINGARI",
        "MANDI BAHAUDDIN",
        "MANGLA",
        "MANGORA",
        "MANSEHRA",
        "MARDAN",
        "MATLI",
        "MEHAR",
        "MEHMOOD KOT",
        "MEHRABPUR",
        "MIAN WALI",
        "MIANCHANNU",
        "MIR PUR A.K.",
        "MIRPIR KHAS",
        "MIRPUR MATHELO",
        "MITHI",
        "MORO",
        "MULTAN",
        "MUREE",
        "MURIDKE",
        "MUZAFARABAD",
        "MUZAFFAR GARH",
        "NANKANA SAHIB",
        "NAROWAL",
        "NAUDERO",
        "NAWAB SHAH",
        "NOSHEHRO FEROZ",
        "NOWSHERA",
        "OKARA",
        "OSTA MOHAMMAD",
        "PAKPATTAN",
        "PANO AQIL",
        "PASROOR",
        "PATTOKI",
        "PESHAWAR",
        "PHALIA",
        "PIND DADAN KHAN",
        "PIR MAHAL",
        "PISHIN",
        "QILA DEEDAR SINGH",
        "QUETTA",
        "RABWAH",
        "RAHIM YAR KHAN",
        "RAIWIND",
        "RAJANPUR",
        "RANI PUR",
        "RATO DERO",
        "RAWALAKOT (AJK)",
        "RAWALPINDI",
        "RENALA KHURD",
        "SADIQABAD",
        "SAHIWAL",
        "SAJAWAL",
        "SAKRAND",
        "SAMBRIAL",
        "SAMUNDRI",
        "SANGHAR",
        "SANGLA HILL",
        "SARGODAH",
        "SEHWAN SHARIF",
        "SHAH KOT",
        "SHAHDAD KOT",
        "SHAHDADPUR",
        "SHIEKHUPURA",
        "SHIKARPUR",
        "SHOR KOT",
        "SHUJA ABAD",
        "SIALKOT",
        "SIBI",
        "SUKKUR",
        "SWAT (MINGORA CITY)",
        "TALAGANG",
        "TANDO ADAM",
        "TANDO ALLAYAR",
        "TANDO JAM",
        "TANDO JAN MUHAMMAD",
        "TANDO M KHAN",
        "TAUNSA SHARIF",
        "TAXILA",
        "THATTA",
        "TIMERGERA",
        "TOBA TEK SINGH",
        "TOPI",
        "UBARO",
        "UMER KOT",
        "VEHARI",
        "WAH CANTT",
        "WAZIRABAD",
        "YAZMAN MANDI",
        "ZAFAR WAL",
    ];

    const isDataExists = await prisma.logisticsCities.findMany();

    if (isDataExists.length !== cityNames.length) {
        console.log(`Adding default cities to database for MNP.`);
        for (const city in cityNames) {
            try {

                const isExists = await prisma.logisticsCities.findFirst({
                    where: {
                        City: cityNames[city]
                    }
                })

                if (isExists) return;

                if (!isExists) console.log(`Adding ${cityNames[city]} to database.`)

                const current = await prisma.logisticsCities.create({
                    data: {
                        City: cityNames[city]
                    }
                })
                if (!current) {
                    console.log(`Unable to add ${cityNames[city]} to database.`)
                    console.log(current)
                }
            } catch (error: any) {
                console.log(error.message)
            }
        }
    }

    const isGridRefreshRateExists = await prisma.settings.findUnique({
        where:{
            name: "Order rows refresh rate"
        }
    })

    if(!isGridRefreshRateExists){
        await prisma.settings.create({
            data:{
                name:"Order rows refresh rate",
                value1: "30"
            }
        })
    }
}