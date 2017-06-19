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

    // create the shipment
    var shipment = factory.newResource(NS, 'Shipment', 'SHIP_001');
    shipment.customsStatus = 'UNCLEARED';
    shipment.invoice = factory.newRelationship(NS, 'Invoice', 'INV_001');

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
            return invoiceRegistry.addAll([invoice]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Shipment');
        })
        .then(function(shipmentRegistry) {
            // add the shipments
            return shipmentRegistry.addAll([shipment]);
        });
}

                    