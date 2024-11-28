const ServicePayment = artifacts.require("ServicePayment");

module.exports = function (deployer) {
    deployer.deploy(ServicePayment).then((instance) => {
        console.log("ServicePayment deployed", instance.address)
    });
}