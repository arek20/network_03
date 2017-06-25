/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Sample transaction processor function.
 * @param {org.acme.sample.SampleTransaction} tx The sample transaction instance.
 * @transaction
 */
function sampleTransaction(tx) {

    // Save the old value of the asset.
    var oldValue = tx.asset.value;

    // Update the asset with the new value.
    tx.asset.value = tx.newValue;

    // Get the asset registry for the asset.
    return getAssetRegistry('org.acme.sample.SampleAsset')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            return assetRegistry.update(tx.asset);

        })
        .then(function () {

            // Emit an event for the modified asset.
            var event = getFactory().newEvent('org.acme.sample', 'SampleEvent');
            event.asset = tx.asset;
            event.oldValue = oldValue;
            event.newValue = tx.newValue;
            emit(event);

        });

}

/**
 * Sample transaction processor function.
 * @param {org.acme.sample.ShipmentCustomsReview} customsReview Customs review import shipment.
 * @transaction
 */
function reviewImportGoods(customsReview) {
    
    // Save the old value of the asset.
    var oldValue = customsReview.shipment.customsStatus;

    // Update the customsStatus with the new value.
    customsReview.shipment.customsStatus = customsReview.reviewStatus;

    // Get the asset registry for the asset.
    return getAssetRegistry('org.acme.sample.Shipment')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            return assetRegistry.update(customsReview.shipment);

        })
        .then(function () {

            // Emit an event for the modified asset.
            var event = getFactory().newEvent('org.acme.sample', 'CustomsEvent');
            event.shipment = customsReview.shipment;
            event.oldCustomsStatus = oldValue;
            event.newCustomsStatus = customsReview.reviewStatus;
            emit(event);

        });

}

/**
 * Initialize some network_03 test assets and participants useful for running a demo.
 * @param {org.acme.sample.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
function setupDemo(setupDemo) {

    var factory = getFactory();
    var NS = 'org.acme.sample';

    // Create the Customs participants
    var usCustoms = factory.newResource(NS, 'CustomsParticipant', 'CUST_01');
    usCustoms.agencyName = 'US Customs and Border Protection';
    usCustoms.country = 'USA';
    var canCustoms = factory.newResource(NS, 'CustomsParticipant', 'CUST_02');
    canCustoms.agencyName = 'Canada Border Services Agency';
    canCustoms.country = 'Canada';

    // Create the Logistics provider participant
    var oneLogistics = factory.newResource(NS, 'LogisticsParticipant', 'LOGI_01');
    var logisticsAddress = factory.newConcept(NS, 'Address');
    logisticsAddress.street = '10 Main St';
    logisticsAddress.city = 'Albany';
    logisticsAddress.state = 'NY';
    logisticsAddress.country = 'USA';
    logisticsAddress.zip = '12201';
    oneLogistics.address = logisticsAddress;
    oneLogistics.email = 'info@corp.com';
    oneLogistics.logisticsName = 'Logistics Company 1';

    // Create the Importer participant
    var importer = factory.newResource(NS, 'ImporterParticipant', 'importer@email.com');
    var importerAddress = factory.newConcept(NS, 'Address');
    importerAddress.street = '10 Blue St';
    importerAddress.city = 'Newark';
    importerAddress.state = 'NJ';
    importerAddress.country = 'USA';
    importerAddress.zip = '07105';
    importer.address = importerAddress;
    importer.contactName = "Susan Importer";
    importer.companyName = "Importex Company";
    importer.tax_Id = "III12345";

    // Create the Shipper participant
    var shipper = factory.newResource(NS, 'ShipperParticipant', 'shipper@email.com.ca');
    var shipperAddress = factory.newConcept(NS, 'Address');
    shipperAddress.street = '340 River Ave';
    shipperAddress.city = 'Montreal';
    shipperAddress.state = 'Quebec';
    shipperAddress.country = 'Canada';
    shipperAddress.zip = 'HA1 OA1';
    shipper.address = shipperAddress;
    shipper.contactName = "Lucy Shipper";
    shipper.companyName = "Exporter Company";
    shipper.tax_Id = "SS12345678";

    // create the contract
    var invoice = factory.newResource(NS, 'Invoice', 'INV_001');
    invoice.customs = factory.newRelationship(NS, 'CustomsParticipant', 'CUST_01');
    invoice.importer = factory.newRelationship(NS, 'ImporterParticipant', 'importer@email.com');
    invoice.shipper = factory.newRelationship(NS, 'ShipperParticipant', 'shipper@email.com.ca');
    invoice.logistics = factory.newRelationship(NS, 'LogisticsParticipant', 'LOGI_01');
    invoice.invoiceNo = 'InvNo 1/2017';
    invoice.wayBillNo = '1Z9842873829729801';
    invoice.dateYYYYMMDD = '2017-05-02';
    invoice.goodsUnits = 4;
    invoice.goodsDescription = 'iPhones';
    invoice.goodsUnitValue = 1000.00;
    invoice.goodsTotalValue = 4000.00;
    invoice.noOfPackages = 1;
    invoice.Currency = 'CAD';
    invoice.totalWeight = 356.00;

    var invoice2 = factory.newResource(NS, 'Invoice', 'INV_002');
    invoice2.customs = factory.newRelationship(NS, 'CustomsParticipant', 'CUST_01');
    invoice2.importer = factory.newRelationship(NS, 'ImporterParticipant', 'importer@email.com');
    invoice2.shipper = factory.newRelationship(NS, 'ShipperParticipant', 'shipper@email.com.ca');
    invoice2.logistics = factory.newRelationship(NS, 'LogisticsParticipant', 'LOGI_01');
    invoice2.invoiceNo = 'InvNo 2/2017';
    invoice2.wayBillNo = '1Z3456789829729801';
    invoice2.dateYYYYMMDD = '2017-05-13';
    invoice2.goodsUnits = 2;
    invoice2.goodsDescription = 'LG Phones';
    invoice2.goodsUnitValue = 500.00;
    invoice2.goodsTotalValue = 1000.00;
    invoice2.noOfPackages = 1;
    invoice2.Currency = 'CAD';
    invoice2.totalWeight = 120.00;

    var invoice3 = factory.newResource(NS, 'Invoice', 'INV_003');
    invoice3.customs = factory.newRelationship(NS, 'CustomsParticipant', 'CUST_01');
    invoice3.importer = factory.newRelationship(NS, 'ImporterParticipant', 'importer@email.com');
    invoice3.shipper = factory.newRelationship(NS, 'ShipperParticipant', 'shipper@email.com.ca');
    invoice3.logistics = factory.newRelationship(NS, 'LogisticsParticipant', 'LOGI_01');
    invoice3.invoiceNo = 'InvNo 3/2017';
    invoice3.wayBillNo = '1Z0000189829729120';
    invoice3.dateYYYYMMDD = '2017-05-14';
    invoice3.goodsUnits = 1;
    invoice3.goodsDescription = 'Sony TV';
    invoice3.goodsUnitValue = 3478.00;
    invoice3.goodsTotalValue = 3478.00;
    invoice3.noOfPackages = 1;
    invoice3.Currency = 'CAD';
    invoice3.totalWeight = 320.00;

    var invoice4 = factory.newResource(NS, 'Invoice', 'INV_004');
    invoice4.customs = factory.newRelationship(NS, 'CustomsParticipant', 'CUST_01');
    invoice4.importer = factory.newRelationship(NS, 'ImporterParticipant', 'importer@email.com');
    invoice4.shipper = factory.newRelationship(NS, 'ShipperParticipant', 'shipper@email.com.ca');
    invoice4.logistics = factory.newRelationship(NS, 'LogisticsParticipant', 'LOGI_01');
    invoice4.invoiceNo = 'InvNo 4/2017';
    invoice4.wayBillNo = '1Z3300189829729999';
    invoice4.dateYYYYMMDD = '2017-05-15';
    invoice4.goodsUnits = 2;
    invoice4.goodsDescription = 'Lenovo Laptop';
    invoice4.goodsUnitValue = 430.00;
    invoice4.goodsTotalValue = 860.00;
    invoice4.noOfPackages = 2;
    invoice4.Currency = 'CAD';
    invoice4.totalWeight = 45.00;

    var invoice5 = factory.newResource(NS, 'Invoice', 'INV_005');
    invoice5.customs = factory.newRelationship(NS, 'CustomsParticipant', 'CUST_01');
    invoice5.importer = factory.newRelationship(NS, 'ImporterParticipant', 'importer@email.com');
    invoice5.shipper = factory.newRelationship(NS, 'ShipperParticipant', 'shipper@email.com.ca');
    invoice5.logistics = factory.newRelationship(NS, 'LogisticsParticipant', 'LOGI_01');
    invoice5.invoiceNo = 'InvNo 5/2017';
    invoice5.wayBillNo = '1Z33001898297543672';
    invoice5.dateYYYYMMDD = '2017-05-21';
    invoice5.goodsUnits = 5;
    invoice5.goodsDescription = 'HP Printer';
    invoice5.goodsUnitValue = 120.00;
    invoice5.goodsTotalValue = 600.00;
    invoice5.noOfPackages = 3;
    invoice5.Currency = 'CAD';
    invoice5.totalWeight = 453.00;

    var invoice6 = factory.newResource(NS, 'Invoice', 'INV_006');
    invoice6.customs = factory.newRelationship(NS, 'CustomsParticipant', 'CUST_01');
    invoice6.importer = factory.newRelationship(NS, 'ImporterParticipant', 'importer@email.com');
    invoice6.shipper = factory.newRelationship(NS, 'ShipperParticipant', 'shipper@email.com.ca');
    invoice6.logistics = factory.newRelationship(NS, 'LogisticsParticipant', 'LOGI_01');
    invoice6.invoiceNo = 'InvNo 6/2017';
    invoice6.wayBillNo = '1Z22245898297546654';
    invoice6.dateYYYYMMDD = '2017-05-23';
    invoice6.goodsUnits = 1;
    invoice6.goodsDescription = 'EMC Storage Array';
    invoice6.goodsUnitValue = 1300000.00;
    invoice6.goodsTotalValue = 1300000.00;
    invoice6.noOfPackages = 18;
    invoice6.Currency = 'CAD';
    invoice6.totalWeight = 4900.00;

    var invoice7 = factory.newResource(NS, 'Invoice', 'INV_007');
    invoice7.customs = factory.newRelationship(NS, 'CustomsParticipant', 'CUST_01');
    invoice7.importer = factory.newRelationship(NS, 'ImporterParticipant', 'importer@email.com');
    invoice7.shipper = factory.newRelationship(NS, 'ShipperParticipant', 'shipper@email.com.ca');
    invoice7.logistics = factory.newRelationship(NS, 'LogisticsParticipant', 'LOGI_01');
    invoice7.invoiceNo = 'InvNo 7/2017';
    invoice7.wayBillNo = '1Z924589829752345674';
    invoice7.dateYYYYMMDD = '2017-06-02';
    invoice7.goodsUnits = 100;
    invoice7.goodsDescription = 'Samsung Galaxy';
    invoice7.goodsUnitValue = 450.00;
    invoice7.goodsTotalValue = 45000.00;
    invoice7.noOfPackages = 100;
    invoice7.Currency = 'CAD';
    invoice7.totalWeight = 400.00;

    // create the shipment
    var shipment = factory.newResource(NS, 'Shipment', 'INV_001');
    shipment.customsStatus = 'UNCLEARED';
    shipment.invoice = factory.newRelationship(NS, 'Invoice', 'INV_001');

    var shipment2 = factory.newResource(NS, 'Shipment', 'INV_002');
    shipment2.customsStatus = 'UNCLEARED';
    shipment2.invoice = factory.newRelationship(NS, 'Invoice', 'INV_002');

    var shipment3 = factory.newResource(NS, 'Shipment', 'INV_003');
    shipment3.customsStatus = 'UNCLEARED';
    shipment3.invoice = factory.newRelationship(NS, 'Invoice', 'INV_003');

    var shipment4 = factory.newResource(NS, 'Shipment', 'INV_004');
    shipment4.customsStatus = 'UNCLEARED';
    shipment4.invoice = factory.newRelationship(NS, 'Invoice', 'INV_004');
    
    var shipment5 = factory.newResource(NS, 'Shipment', 'INV_005');
    shipment5.customsStatus = 'UNCLEARED';
    shipment5.invoice = factory.newRelationship(NS, 'Invoice', 'INV_005');
    
    var shipment6 = factory.newResource(NS, 'Shipment', 'INV_006');
    shipment6.customsStatus = 'UNCLEARED';
    shipment6.invoice = factory.newRelationship(NS, 'Invoice', 'INV_006');
    
    var shipment7 = factory.newResource(NS, 'Shipment', 'INV_007');
    shipment7.customsStatus = 'UNCLEARED';
    shipment7.invoice = factory.newRelationship(NS, 'Invoice', 'INV_007');

    return getParticipantRegistry('org.acme.sample.CustomsParticipant')
        .then(function (participantRegistry) {
            // add the Customs participants
            return participantRegistry.addAll([usCustoms, canCustoms]);
        })
        .then(function () {
            // add the Logistics Provider participant
            return getParticipantRegistry('org.acme.sample.LogisticsParticipant');
        })
        .then(function(logisticsRegistry) {
            return logisticsRegistry.addAll([oneLogistics]);
        })
        .then(function () {
            // add the Importer participant
            return getParticipantRegistry('org.acme.sample.ImporterParticipant');
        })
        .then(function(importerRegistry) {
            return importerRegistry.addAll([importer]);
        })
        .then(function () {
            // add the Shipper participant
            return getParticipantRegistry('org.acme.sample.ShipperParticipant');
        })
        .then(function(shipperRegistry) {
            return shipperRegistry.addAll([shipper]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Invoice');
        })
        .then(function(invoiceRegistry) {
            // add the invoices
            return invoiceRegistry.addAll([invoice,invoice2,invoice3,invoice4,invoice5,invoice6,invoice7]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Shipment');
        })
        .then(function(shipmentRegistry) {
            // add the shipments
            return shipmentRegistry.addAll([shipment,shipment2,shipment3,shipment4,shipment5,shipment6,shipment7]);
        });
}

                    