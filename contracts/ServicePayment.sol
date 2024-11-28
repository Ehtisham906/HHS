// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ServicePayment {
    address public owner;

    struct ServiceRequest {
        string serviceType;
        string specificService;
        address payable client;
        uint256 ethAmount;
        bool isPaid;
    }

    mapping(uint256 => ServiceRequest) public serviceRequests;
    uint256 public serviceCounter;

    event ServiceRequested(
        uint256 serviceId,
        address client,
        string serviceType,
        string specificService,
        uint256 ethAmount
    );

    event ServicePaid(uint256 serviceId, address client, uint256 amountPaid);

    constructor() {
        owner = msg.sender;
    }

    // Function to create a service request
    function createServiceRequest(string memory _serviceType, string memory _specificService, uint256 _ethAmount) public {
        serviceCounter++;
        serviceRequests[serviceCounter] = ServiceRequest({
            serviceType: _serviceType,
            specificService: _specificService,
            client: payable(msg.sender),
            ethAmount: _ethAmount,
            isPaid: false
        });

        emit ServiceRequested(serviceCounter, msg.sender, _serviceType, _specificService, _ethAmount);
    }

    // Function to pay for a service request
    function payForService(uint256 serviceId) public payable {
        ServiceRequest storage service = serviceRequests[serviceId];

        require(msg.value == service.ethAmount, "Incorrect payment amount.");
        require(service.isPaid == false, "Service already paid for.");

        service.client.transfer(msg.value); // Pay the service provider
        service.isPaid = true;

        emit ServicePaid(serviceId, msg.sender, msg.value);
    }
}
