const getMetadataHierarchies = (schema) => {
    const metadataHierarchies = {
        isadg: {}
    };

    metadataHierarchies.isadg = {
        'isad(g)-reference code(s)': 'Identity Statement',
        'isad(g)-title': 'Identity Statement',
        'isad(g)-date(s)': 'Identity Statement',
        'isad(g)-level of description': 'Identity Statement',
        'isad(g)-extent and medium of the unit of description': 'Identity Statement',
        'isad(g)-name of creator(s)': 'Context',
        'isad(g)-administrative/biographical history': 'Context',
        'isad(g)-archival history': 'Context',
        'isad(g)-immediate source of acquisition or transfer': 'Context',
        'isad(g)-scope and content': 'Content And Structure',
        'isad(g)-appraisal, destruction and scheduling information': 'Content And Structure',
        'isad(g)-accruals': 'Content And Structure',
        'isad(g)-system of arrangement': 'Content And Structure',
        'isad(g)-conditions governing access': 'Conditions Of Access And Use',
        'isad(g)-conditions governing reproduction': 'Conditions Of Access And Use',
        'isad(g)-language/scripts of material': 'Conditions Of Access And Use',
        'isad(g)-physical characteristics and technical requirements': 'Conditions Of Access And Use',
        'isad(g)-finding aids': 'Conditions Of Access And Use',
        'isad(g)-existence and location of originals': 'Allied Materials',
        'isad(g)-existence and location of copies': 'Allied Materials',
        'isad(g)-related units of description': 'Allied Materials',
        'isad(g)-publication note': 'Allied Materials',
        'isad(g)-note': 'Notes',
        'isad(g)-archivists note': 'Description Control',
        'isad(g)-rules or conventions': 'Description Control',
        'isad(g)-date(s) of descriptions': 'Description Control',
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