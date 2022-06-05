import RedshiftClient from './redshift.client';

const bootstrap = async () => {
  const result = await RedshiftClient.executeQuery(
    "INSERT INTO \"collector-db\".\"public\".\"owners\"(id, name, createdby, createddate, updateddate, updatedby) VALUES('01', 'serhan', 'suras', '20-08-2020', '20-08-2020', 'suras')",
  );

  console.log({ result });
};

bootstrap();
