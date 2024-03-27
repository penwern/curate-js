const getMetadataHierarchies = (schema) => {
    const metadataHierarchies = {
        "ISAD(G)": {},
        "DC": {}
    };
    metadataHierarchies["DC"] = {
        fields: [
            "contributor",
            "coverage",
            "creator",
            "date",
            "description",
            "format",
            "identifier",
            "language",
            "publisher",
            "relation",
            "rights",
            "source",
            "subject",
            "title",
            "type"
        ]
    };
    metadataHierarchies["ISAD(G)"] = {
        sections: [
            {
                title: "Identity Statement",
                fields: [
                    "reference code(s)",
                    "title",
                    "date(s)",
                    "level of description",
                    "extent and medium of the unit of description"
                ]
            },
            {
                title: "Context",
                fields: [
                    "name of creator(s)",
                    "administrative/biographical history",
                    "archival history",
                    "immediate source of acquisition or transfer"
                ]
            },
            {
                title: "Content And Structure",
                fields: [
                    "scope and content",
                    "appraisal, destruction and scheduling information",
                    "accruals",
                    "system of arrangement"
                ]
            },
            {
                title: "Conditions Of Access And Use",
                fields: [
                    "conditions governing access",
                    "conditions governing reproduction",
                    "language/scripts of material",
                    "physical characteristics and technical requirements",
                    "finding aids"
                ]
            },
            {
                title: "Allied Materials",
                fields: [
                    "existence and location of originals",
                    "existence and location of copies",
                    "related units of description",
                    "publication note"
                ]
            },
            {
                title: "Notes",
                fields: [
                    "note"
                ]
            },
            {
                title: "Description Control",
                fields: [
                    "archivists note",
                    "rules or conventions",
                    "date(s) of descriptions"
                ]
            }
        ]
    };
      
    if (schema && schema in metadataHierarchies){
        return metadataHierarchies[schema]
    }else if(schema){
        console.error("invalid schema")
    }else{
        return metadataHierarchies;
    }
};

export default getMetadataHierarchies;