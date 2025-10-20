import * as Yup from 'yup'
export const signInValidator = () => {
    return Yup.object().shape({
        email:
            Yup.string().required("Email is empty").email("Invalide email format"),
        password: Yup.string().required("Password is empty"),
    });
}


export const businessValidator = () => {
    return Yup.object().shape({
        // Submitter/Contact Info
        contactName: Yup.string()
            .required("Le nom de contact est obligatoire")
            .min(2, "Le nom doit contenir au moins 2 caractères"),
        
        contactEmail: Yup.string()
            .notRequired().nullable()
            .email("Format d'email invalide"),
        
        contactPhone: Yup.string()
            .transform((value) => value.replace(/\D/g, "")) // Remove non-numeric characters
            .matches(/^\d{8,15}$/, "Numéro de téléphone invalide")
            .required("Le téléphone de contact est obligatoire"),

        // Business Info
        name: Yup.string()
            .required("Le nom de l'entreprise est obligatoire")
            .min(3, "Le nom doit contenir au moins 3 caractères"),
        
        category: Yup.string()
            .required("La catégorie est obligatoire"),
        
        location: Yup.string()
            .required("La localisation est obligatoire"),
        
        fullAddress: Yup.string().nullable(),
        
        description: Yup.string()
            .required("La description est obligatoire")
            .min(50, "La description doit contenir au moins 50 caractères")
            .max(5000, "La description ne peut pas dépasser 5000 caractères"),
        
        additionalInfo: Yup.string()
            .max(5000, "Les informations supplémentaires ne peuvent pas dépasser 5000 caractères")
            .nullable(),

        // Financial
        price:  Yup.string()
        .matches(/^(?:\d*\.?\d+)?$/, 'Prix invalide') // Ensures it is a number
        .nullable()
        .required("Le prix est obligatoire"), 


        yearEstablished: Yup.string()
            .matches(/^(?:\d*\.?\d+)?$/, 'Année invalide') // Ensures it is a number
            .required("L'année de création est obligatoire")
            .max(new Date().getFullYear(), "L'année ne peut pas être dans le futur"),
        
        employees: Yup.string()
            .matches(/^(?:\d*\.?\d+)?$/, 'Nombre d\'employés invalide')
            .nullable()
            .min(1, "L'entreprise doit avoir au moins 1 employé")
            .max(1000000, "Nombre d'employés invalide"),

        monthlyRevenue: Yup.string()
            .matches(/^(?:\d*\.?\d+)?$/, 'Revenu mensuel invalide')
            .nullable(),


        yearlyRevenue: Yup.string()
            .matches(/^(?:\d*\.?\d+)?$/, 'Revenu annuel invalide')
            .nullable()
            .min(0, "Le revenu annuel doit être positif")
            .max(999999999.99, "Montant trop élevé")
            .nullable(),

          
        // Assets & Advantages (validated separately in component)
        assets: Yup.array()
            .of(Yup.string())
            .nullable(),
        
        advantages: Yup.array()
            .of(Yup.string())
            .nullable(),
        
        reasons: Yup.string()
            .max(5000, "Les raisons de vente ne peuvent pas dépasser 5000 caractères")
            .nullable(),

        // Media (optional fields for form state)
        newAsset: Yup.string().nullable(),
        newAdvantage: Yup.string().nullable(),
        photos: Yup.array().of(Yup.mixed()).nullable(),
        videos: Yup.array().of(Yup.mixed()).nullable()
    });
};


export const profileValidator = () => {
    return Yup.object().shape({
        firstName: Yup.string()
            .required("Le prénom est obligatoire")
            .min(2, "Le prénom doit contenir au moins 2 caractères"),
        lastName: Yup.string()
            .required("Le nom est obligatoire")
            .min(2, "Le nom doit contenir au moins 2 caractères"),
    });
}
export const passwordValidator = () => {
    return Yup.object().shape({
        currentPassword: Yup.string()
            .required("Le mot de passe actuel est obligatoire")
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        newPassword: Yup.string()
            .required("Le nouveau mot de passe est obligatoire")
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: Yup.string()
            .required("La confirmation du mot de passe est obligatoire")
            .oneOf([Yup.ref('newPassword'), null], "Les mots de passe doivent correspondre"),
    });
}