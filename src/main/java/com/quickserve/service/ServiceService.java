package com.quickserve.service;

import com.quickserve.dto.ServiceDto;

import java.util.List;

public interface ServiceService {
    ServiceDto createService(ServiceDto serviceDto);

    ServiceDto getServiceById(Long id);

    List<ServiceDto> getAllServices();

    List<ServiceDto> getServicesByProviderId(Long providerId);

    ServiceDto updateService(Long id, ServiceDto serviceDto);

    void deleteService(Long id);
}
