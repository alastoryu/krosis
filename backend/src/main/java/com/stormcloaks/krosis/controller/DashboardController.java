package com.stormcloaks.krosis.controller;

import com.stormcloaks.krosis.dto.DashboardResumoDTO;
import com.stormcloaks.krosis.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public DashboardResumoDTO getResumo() {
        return dashboardService.getResumo();
    }
}