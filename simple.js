'use strict';

function queryFilterController($scope,$modalInstance, $filter, queryFilterService,commonQueryService, scopeQuery ) {
	$scope.initiated = false;
	$scope.viewType = scopeQuery.viewType;
	$scope.commonService = commonQueryService;
	$scope.isReport = false;
	$scope.paymentStatus ={};
	$scope.available={};
	$scope.selected={};
	$scope.user={};
	$scope.useBackendFilter = queryFilterService.useBackendFilter;
	$scope.searchResultAvailable = (queryFilterService.searchResult.length > 0) ? true : false;
	$scope.setOnlyResultValuesInAvailable = function(){
	$scope.available.merchantIdList=$filter('unique')( queryFilterService.searchResult, 'merchantId');
	$scope.available.bankIdList=$filter('unique')( queryFilterService.searchResult, 'bankId');
	$scope.available.paymentCategoryList=$filter('unique')( queryFilterService.searchResult, 'paymentCategory');
	$scope.available.networkList=$filter('unique')( queryFilterService.searchResult, 'network');
	$scope.available.paymentStatusList=$filter('unique')( queryFilterService.searchResult, 'status');
	$scope.available.settlementStatusList=$filter('unique')( queryFilterService.searchResult, 'settlementStatus');
	$scope.available.uaDeviceCategoryList=$filter('unique')( queryFilterService.searchResult, 'uaDeviceCategory');
	$scope.available.amount= $scope.getMinMaxAmount(queryFilterService.searchResult);
	if($scope.selected.amount.min == NaN && $scope.selected.amount.max == NaN)
	$scope.setSelectedAmountToAvailable();
	}
	
	$scope.setSelectedAmountToAvailable = function(){
	     angular.copy($scope.available.amount,$scope.selected.amount);
	}
	
	$scope.getMinMaxAmount = function(list){
		var lowest = Number.POSITIVE_INFINITY;
		var highest = Number.NEGATIVE_INFINITY;
		var newObj={};
		var tmp;
		for (var i=list.length-1; i>=0; i--) {
		    tmp = list[i].amount;
		    if (tmp < lowest) lowest = tmp;
		    if (tmp > highest) highest = tmp;
		}
		if (lowest == highest){
			newObj.min = newObj.max = lowest;
		}
		else{
			newObj.min = Math.floor(lowest) ;	//Take the floor value for the minimum amount
			newObj.max = Math.ceil(highest);	//Take the ceil value for the maximum amount
		}
		//console.log(highest, lowest);
		return newObj;
	}
	
	$scope.setAllValuesInAvailable = function(){
		angular.copy(queryFilterService.user,$scope.available);
	}
	
	angular.copy(queryFilterService.selected,$scope.selected);
	angular.copy(queryFilterService.user,$scope.user);
	angular.copy(commonQueryService.paymentStatus,$scope.paymentStatus);
	
	if($scope.viewType != commonQueryService.viewType.QUERY)
		$scope.selected.paymentStatusList = [$scope.paymentStatus.SUCCESS];
	
	$scope.statusCheck = function(){
		var indexPending = $scope.selected.paymentStatusList.indexOf($scope.paymentStatus.PENDING);
		var indexError = $scope.selected.paymentStatusList.indexOf($scope.paymentStatus.ERROR);
		if(indexPending > -1)
			{
			if(indexError == -1 )$scope.selected.paymentStatusList.push($scope.paymentStatus.ERROR);
			}
		else if(indexError > -1 )$scope.selected.paymentStatusList.splice(indexError,1);
	}
	

	
		              $scope.isDisabled = function(list,item) {
		            	  if(typeof list === 'undefined')return false;
		            	  var filtered=$filter('filter')(list, item , true);
		            	  if ( filtered.length > 0  )return false;
		            	  else return true;
		              }
		              
		              $scope.clearFilters = function(){
		            		$scope.selected.merchantIdList = [];
		            		$scope.selected.bankIdList = [];
		            		$scope.selected.paymentCategoryList = [];
		            		$scope.selected.networkList = [];
		            		$scope.selected.settlementStatusList = [];
		            		$scope.selected.uaDeviceCategoryList = [];
		            		$scope.setSelectedAmountToAvailable();
		            		if($scope.viewType == commonQueryService.viewType.QUERY)
		            			$scope.selected.paymentStatusList = [];
		            		$('#amountMax').val('');
		            		$('#amountMin').val('');
		              }
		              

		              
		              $scope.applyFilters = function(){
		            	  	if($scope.searchResultAvailable || $scope.amountCheck())
		            		{
		            	  angular.copy($scope.selected,queryFilterService.selected);
							$filter('resultFilter')( queryFilterService.searchResult,commonQueryService.viewType.QUERY);
							if(queryFilterService.searchResult.length > queryFilterService.currentView.length)
								{
								queryFilterService.filterActive = true;
								}
							else
								{
								queryFilterService.filterActive = false;
								}
							if(queryFilterService.useBackendFilter)scopeQuery.getData();
		               		$modalInstance.close();
		            		}		            	  
		              }
		              
		              $scope.amountCheck = function(){
		            	  var check= ((($scope.selected.amount.max >= $scope.selected.amount.min) || 
		            			  $scope.selected.amount.min == null || $scope.selected.amount.max == null ||
		            			  isNaN($scope.selected.amount.min) || isNaN($scope.selected.amount.max))
		            			  && !( $scope.filterForm.amountMin.$error.number | $scope.filterForm.amountMax.$error.number 
		            			  || $scope.filterForm.amountMin.$error.min || $scope.filterForm.amountMax.$error.min))
		            	  return check;
		              }
		              
		              $scope.launchFilter = function() {
		            	  if (queryFilterService.searchResult.length>0)
		            		  {
		            		  $scope.setOnlyResultValuesInAvailable();
		            		  }
		            	  else
		            		  {
		            		  $scope.setAllValuesInAvailable();
		            		  }
		              }
		      $scope.launchFilter();

		      $scope.close = function(){
				$modalInstance.close();
			}

}

function reportFilterController($scope,$modalInstance, $filter, reportFilterService, commonQueryService, scopeReport ) {
	$scope.commonService = commonQueryService;
	$scope.viewType = scopeReport.viewType;
	$scope.isReport = true;
	$scope.paymentStatus ={};
	$scope.selected={};
	$scope.user={};

	angular.copy(reportFilterService.selected,$scope.selected);
	angular.copy(reportFilterService.user,$scope.user);
	angular.copy(commonQueryService.paymentStatus,$scope.paymentStatus);
	
	$scope.statusCheck = function(){
		var indexPending = $scope.selected.paymentStatusList.indexOf($scope.paymentStatus.PENDING);
		var indexError = $scope.selected.paymentStatusList.indexOf($scope.paymentStatus.ERROR);
		if(indexPending > -1)
			{
			if(indexError == -1 )$scope.selected.paymentStatusList.push($scope.paymentStatus.ERROR);
			}
		else if(indexError > -1 )$scope.selected.paymentStatusList.splice(indexError,1);
	}
	
	
			              $scope.clearFilters = function(){
		            		$scope.selected.merchantIdList = [];
		            		$scope.selected.bankIdList = [];
		            		$scope.selected.paymentCategoryList = [];
		            		$scope.selected.networkList = [];
		            		$scope.selected.paymentStatusList = [];
		            		$scope.selected.settlementStatusList = [];
		            		$scope.selected.uaDeviceCategoryList = [];
		            		$scope.selected.amount={min: NaN,max: NaN} ;
		            		$('#amountMax').val('');
		            		$('#amountMin').val('');
		              }
		              
		              $scope.applyFilters = function(){
		            	  	if($scope.amountCheck())
		            		{
		            	  		angular.copy($scope.selected,reportFilterService.selected);
		            	  		scopeReport.initiateSearch();
		                   		$modalInstance.close();
		            		}
		            		}
		              
		              $scope.amountCheck = function(){
		            	  var check= ((($scope.selected.amount.max >= $scope.selected.amount.min) || 
		            			  $scope.selected.amount.min == null || $scope.selected.amount.max == null ||
		            			  isNaN($scope.selected.amount.min) || isNaN($scope.selected.amount.max))
		            			  && !( $scope.filterForm.amountMin.$error.number | $scope.filterForm.amountMax.$error.number 
		            			  || $scope.filterForm.amountMin.$error.min || $scope.filterForm.amountMax.$error.min))
		            	  return check;
		              }

		              $scope.close = function(){
		        		$modalInstance.close();
		        	}

}


function reportController($scope, $http, $modal, $filter, $location, sharedDataService , Pagination , reportFilterService ,commonQueryService, User) {
	reportFilterService.clearSelectedFilter();
	$scope.initiated = false;
	$scope.commonService = commonQueryService;
	$scope.queryConfig = User.getQueryFeature();
	$scope.isSearching = false;
	$scope.paymentStatus = {};
	$scope.currentView =[];
	$scope.searchPlaceHolder = "";
	$scope.tags=['first','second'];
	$scope.pagination = Pagination.getNew(10);
	$scope.Reverse=true;
	$scope.from = from;
	$scope.to = to;
	$scope.searchValue = "";
	$scope.selectedRow="";
	$scope.pagination.rowPerPageOption="";
	$scope.pagination.firstPage="";
	$scope.pagination.lastPage="";
	$scope.pagination.selectRange="";
	$scope.pagination.visibleLimit="";
	$scope.advanceSearch={};
	$scope.advanceSearch.isOpen = false;
	$scope.advanceSearch.creditCardName={};	
	$scope.advanceSearch.creditCardName.param="creditCardName";
	$scope.advanceSearch.creditCardName.value="";
	$scope.advanceSearch.creditCardName.useLike=true;
	$scope.advanceSearch.creditCardName.caseIgnore=true;

	$scope.advanceSearch.cardFirstSix={};	
	$scope.advanceSearch.cardFirstSix.param="cardFirstSix";
	$scope.advanceSearch.cardFirstSix.value="";
	$scope.advanceSearch.cardFirstSix.useLike=true;
	$scope.advanceSearch.cardFirstSix.caseIgnore=true;

	$scope.advanceSearch.cardLastFour={};	
	$scope.advanceSearch.cardLastFour.param="cardLastFour";
	$scope.advanceSearch.cardLastFour.value="";
	$scope.advanceSearch.cardLastFour.useLike=true;
	$scope.advanceSearch.cardLastFour.caseIgnore=true;

	$scope.resultCount = 0;
	$scope.advanceSearch.tidName={};	
	$scope.advanceSearch.tidName.param="tidName";
	$scope.advanceSearch.tidName.value="";
	$scope.advanceSearch.tidName.useLike=true;
	$scope.advanceSearch.tidName.caseIgnore=true;
	
	$scope.advanceSearch.ipAddress={};	
	$scope.advanceSearch.ipAddress.param="ipAddress";
	$scope.advanceSearch.ipAddress.value="";
	$scope.advanceSearch.ipAddress.useLike=true;
	$scope.advanceSearch.ipAddress.caseIgnore=true;
	$scope.MAXDOWNLOADSIZE = 50000;
	
	$scope.advanceSearch.paramList = [$scope.advanceSearch.ipAddress,$scope.advanceSearch.cardFirstSix,$scope.advanceSearch.cardLastFour,$scope.advanceSearch.tidName,$scope.advanceSearch.creditCardName]

	$scope.requestReportParam = {};
	
	$scope.GroupId;
	$scope.getGroupId = function(){
		return sessionStorage.getItem("groupId").toLowerCase();
	}	
	
	angular.copy(commonQueryService.paymentStatus,$scope.paymentStatus);

	$scope.prepareAdvanceSearchParameter = function(){
		var list = [];
		for (var i=0; i <  $scope.advanceSearch.paramList.length ;++i){
			if($scope.advanceSearch.paramList[i].value != "")
				list.push($scope.advanceSearch.paramList[i])
		}
		return list;
	}
	
	$scope.prepareFilterParameter = function(){
		var filterList= {};
		var minMaxList = [];
		angular.copy(reportFilterService.selected,filterList);
		filterList.merchantIdList=commonQueryService.convertToArrayOfString(filterList.merchantIdList,'actualValue');
		filterList.bankIdList=commonQueryService.convertToArrayOfString(filterList.bankIdList,'actualValue');
		minMaxList.push(filterList.amount.min);
		minMaxList.push(filterList.amount.max);
		filterList.amount = minMaxList;
		return filterList;
	}
	
	$scope.reSort	=	function(column) {
		if ($scope.sortColumn == column)
			$scope.Reverse=!$scope.Reverse;
		else
			$scope.sortColumn=column;
	}

	$scope.requestReport = function(fileFormat) {
		$scope.advanceSearch.dismissAdvanceSearch();
		
		$scope.GroupId=$scope.getGroupId();
		console.log($scope.GroupId);
		
		if($scope.GroupId == 'amazonlive' || $scope.GroupId == 'amazon' || $scope.GroupId == 'snapdeal' || $scope.GroupId == 'acttv' ) $scope.MAXDOWNLOADSIZE=100000;
		console.log($scope.MAXDOWNLOADSIZE);
		if ($scope.resultCount <= $scope.MAXDOWNLOADSIZE)
			{
			$scope.placeRequest($scope.requestReportParam,fileFormat);
			return;
			}
		//If the count is > 50000 then display appropriate message to the user
		var displayInfo ={};
		displayInfo.title = 'Report results exceed the set limit';
		displayInfo.message = 'Please filter your search and regenerate the report.';
		displayInfo.status = 'WARNING';
		displayInfo.resultCount = $scope.resultCount;
		displayInfo.MAXDOWNLOADSIZE = $scope.MAXDOWNLOADSIZE;
		$scope.showReportRequestFeedback(displayInfo);
	}
	

	
	$scope.placeRequest = function (requestReportParam , fileFormat){
		var data = {
						"reportType":"PG_QUERY_PAYMENT",
						"fileFormat":fileFormat,
						"param":{
								"fromTimestamp":requestReportParam.fromTimestamp,
								"toTimestamp":requestReportParam.toTimestamp,
								"searchString":requestReportParam.searchString,
								"advanceParamList":requestReportParam.advanceParamList,
								"filterList":requestReportParam.filterList
								}
					};
		console.log(JSON.stringify(data));
		sharedDataService
				.loadData(
						'/services/query/requestReport',
						'POST',
						data,
						'',
						'',
						function(response) {
							var displayInfo ={};
							displayInfo.MAXDOWNLOADSIZE = $scope.MAXDOWNLOADSIZE;
							if(response == 'Request Failed')
								{
								displayInfo.title = 'Sorry, we are not able to process your request right now';
								displayInfo.message = 'Please contact your system support team for assistance.';
								displayInfo.status = 'ERROR';
								displayInfo.resultCount = -1;
								}
							else if(response == 'SUCCESS'){
								displayInfo.title = 'Report queued for downloading';
								displayInfo.message = '';
								displayInfo.status = response;
								displayInfo.resultCount = $scope.resultCount;
								}
							else if(response == 'WARNING'){
								displayInfo.title = 'Your current download requests are being processed. Please try after some time.';
								displayInfo.message = 'Please try after some time.';
								displayInfo.status = response;
								displayInfo.resultCount = -1;
								}
							else if(response == 'WARNING2'){
								displayInfo.title = 'Sorry, you have reached your daily limit on reports.';
								displayInfo.message = 'Please try tomorrow.';
								displayInfo.status = response;
								displayInfo.resultCount = -1;
								}
							$scope.showReportRequestFeedback(displayInfo);
						}
						)};
	
	$scope.loadData = function(searchString, from, to ,advanceSearchParameter ,filterList ,pageNo ,pageSize) {
		$scope.isSearching = true;
		$scope.advanceSearch.hideAdvanceSearchPopover();
		var data = {
				"fromTimestamp":from,
				"toTimestamp":to,
				"searchString":searchString,
				"advanceParamList":advanceSearchParameter,
				"filterList":filterList,
				"pageNo":pageNo,
				"pageSize":pageSize
				};
		console.log(JSON.stringify(data));
		sharedDataService
				.loadData(
						'/services/query/fetchReportData',
						'POST',
						data,
						'refTableLoader',
						'refTable',
						function(dataResponse) {
							$scope.rows=dataResponse['data'];
							if(dataResponse['size'] > -1)
								{
								$scope.resultCount = dataResponse['size'];
								$scope.resetPagination();
								}
							$scope.currentView= $scope.rows;
							angular.copy(data,$scope.requestReportParam);
							$scope.isSearching = false;
							$scope.advanceSearch.dismissAdvanceSearch();
							console.log($scope.rows);
								});
	};
	
	$scope.retrievePage = function() {
		var	advanceSearchParameter = $scope.prepareAdvanceSearchParameter();
		var filterList=$scope.prepareFilterParameter();
		$scope.loadData($scope.searchValue,reportFilterService.dateRange.startDate,
				reportFilterService.dateRange.endDate,
				advanceSearchParameter,filterList ,$scope.pagination.page, $scope.pagination.perPage );
		}
	
	$scope.initiateSearch = function(paginationChange) {
		if(paginationChange && $scope.currentView.length == 0)return;
		$scope.initiated = true;
		$scope.pagination.page = 0;
		$scope.retrievePage();
	}
	
	
	$scope.populateHeaders = function (header) {
		$scope.merchantDetailHeader=header.MERCHANTDETAIL;
		$scope.paymentDetailHeaderCard=header.PAYMENTDETAIL;
		$scope.paymentDetailHeader= _.cloneDeep(header.PAYMENTDETAIL);
			_.remove($scope.paymentDetailHeader, function(item) {
			  return ( item.fieldName == 'maskedCardNumber' || item.fieldName == 'cardHolderName');
		});
		$scope.sourceDetailHeader=header.SOURCEDETAIL;
		$scope.settlementDetailHeader=header.SETTLEMENTDETAIL;
		$scope.searchResultHeader=header.SEARCHRESULT;
		$scope.refundDetailHeader=header.REFUNDDETAIL;
		$scope.postingDetailHeader=header.POSTINGDETAIL;
	}
	
	$scope.getPaymentDetailHeader = function(isCard){
		if( isCard )
			return $scope.paymentDetailHeaderCard;
		else
			return $scope.paymentDetailHeader;
	}
	
	$scope.resetPagination = function () {
		$scope.pagination.page=0;
		$scope.pagination.numPages = Math.ceil($scope.resultCount/$scope.pagination.perPage);
		$scope.pagination.firstPage=0;
		$scope.pagination.selectRange=[];
		var upperLimit = 5;
		$scope.pagination.lastPage=$scope.pagination.numPages-1;
		$scope.pagination.visibleLimit=($scope.pagination.numPages< $scope.pagination.upperLimit ? $scope.pagination.numPages : $scope.pagination.upperLimit);
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.firstPage);
		
	}
	
	$scope.pagination.createRangeList = function ( min  ){
		var list = [];
		for(var i= min ; i < min + $scope.pagination.visibleLimit   ;i++) {
			list.push(i);
			}
		return list;
	}
	
	$scope.pagination.goFirst = function () {
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.firstPage);
		$scope.pagination.page = $scope.pagination.firstPage;
		$scope.retrievePage();
	}

	$scope.pagination.goLast = function () {
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.lastPage-$scope.pagination.visibleLimit+1 );
		$scope.pagination.page = $scope.pagination.lastPage;
		$scope.retrievePage();
	}

	$scope.pagination.toPage = function (pageNo) {
		$scope.pagination.page = pageNo;
		$scope.retrievePage();
	}
	
	$scope.pagination.goLeft = function () {
		if($scope.pagination.selectRange[0] == $scope.pagination.page)
			{
				$scope.pagination.selectRange.pop();
				$scope.pagination.page = $scope.pagination.page - 1;
				$scope.pagination.selectRange.unshift($scope.pagination.page);
			}
		else
			{
			$scope.pagination.page = $scope.pagination.page - 1;
			}
		$scope.retrievePage();
	}
	
	$scope.pagination.goRight = function () {
		if($scope.pagination.selectRange[$scope.pagination.visibleLimit-1] == $scope.pagination.page)
			{
				$scope.pagination.selectRange.shift();
				$scope.pagination.page = $scope.pagination.page + 1;
				$scope.pagination.selectRange.push($scope.pagination.page);
			}
		else
			{
			$scope.pagination.page = $scope.pagination.page + 1;
			}
		$scope.retrievePage();
	}
	
	$scope.selectRow = function(id) {
		if($scope.selectedRow != id){
		//console.log('row selected',$scope.selectedRow,id);
		$scope.selectedRow=id;
	}
		else{	
			//console.log('row Deselected',$scope.selectedRow,id);
			$scope.selectedRow="";
	}
		
		
	}
	
	$scope.isSelected = function(id) {
		//console.log('checking selected',id,$scope.selectedRow);
		if($scope.selectedRow == id ) return true;
		else return false;
	}
	
	
	$scope.setInitialUserInfo = function(dataResponse,searchPlaceHolder) {
		$scope.populateHeaders(dataResponse.headerInfo);
		$scope.searchPlaceHolder = searchPlaceHolder;
		$scope.reSort('txnTime');
		$scope.pagination.rowPerPageOption=[10,20,50];
		$scope.pagination.upperLimit=5;
		reportFilterService.user = dataResponse.filterInfo;
		reportFilterService.user.amount={min:NaN,max:NaN};
	}
	
	commonQueryService.getInitialUserInfo($scope.setInitialUserInfo);	
	
	$scope.openFilter = function(){
		$modal.open({
		      templateUrl: 'static/partials/Transaction/modalFilter.html',
	      controller: 'reportFilterController',
	      size: 'lg',
	      resolve: {
		    	  scopeReport : function() {
		    		  return $scope;
	      }
		}
	      
	    });
	}

	$scope.showReportRequestFeedback = function(displayInfo){
		$modal.open({
		      templateUrl: 'static/partials/Transaction/reportRequestFeedback.html',
	      controller: 'reportRequestFeedbackController',
	      resolve: { displayInfo : function(){return displayInfo;}    
	      }
	    });
	}
	
	$scope.advanceSearch.toggleAdvanceSearch = function(){
		$scope.advanceSearch.isOpen = !$scope.advanceSearch.isOpen;
		if ($scope.advanceSearch.isOpen)$('#advanceSearch').popover('show');
		else {
			$scope.advanceSearch.dismissAdvanceSearch();
		}
	}
	
	$scope.advanceSearch.hideAdvanceSearchPopover = function(){
		$scope.advanceSearch.isOpen = false;
		$('#advanceSearch').popover('hide');
	}
	
	$scope.advanceSearch.dismissAdvanceSearch = function(){
			$scope.advanceSearch.hideAdvanceSearchPopover();
			$scope.advanceSearch.ipAddress.value="";
			$scope.advanceSearch.tidName.value="";
			$scope.advanceSearch.creditCardName.value="";
			$scope.advanceSearch.cardFirstSix.value="";
			$scope.advanceSearch.cardLastFour.value="";
	}

}
//Accountno report

function reportController2($scope, $http, $modal, $filter, $location, sharedDataService , Pagination , reportFilterService ,commonQueryService, User) {
	reportFilterService.clearSelectedFilter();
	$scope.initiated = false;
	$scope.commonService = commonQueryService;
	$scope.queryConfig = User.getQueryFeature();
	$scope.isSearching = false;
	$scope.paymentStatus = {};
	$scope.currentView =[];
	$scope.searchPlaceHolder = "";
	$scope.tags=['first','second'];
	$scope.pagination = Pagination.getNew(10);
	$scope.Reverse=true;
	$scope.from = from;
	$scope.to = to;
	$scope.searchValue = "";
	$scope.selectedRow="";
	$scope.pagination.rowPerPageOption="";
	$scope.pagination.firstPage="";
	$scope.pagination.lastPage="";
	$scope.pagination.selectRange="";
	$scope.pagination.visibleLimit="";
	$scope.advanceSearch={};
	$scope.advanceSearch.isOpen = false;
	$scope.advanceSearch.creditCardName={};	
	$scope.advanceSearch.creditCardName.param="creditCardName";
	$scope.advanceSearch.creditCardName.value="";
	$scope.advanceSearch.creditCardName.useLike=true;
	$scope.advanceSearch.creditCardName.caseIgnore=true;

	$scope.advanceSearch.cardFirstSix={};	
	$scope.advanceSearch.cardFirstSix.param="cardFirstSix";
	$scope.advanceSearch.cardFirstSix.value="";
	$scope.advanceSearch.cardFirstSix.useLike=true;
	$scope.advanceSearch.cardFirstSix.caseIgnore=true;

	$scope.advanceSearch.cardLastFour={};	
	$scope.advanceSearch.cardLastFour.param="cardLastFour";
	$scope.advanceSearch.cardLastFour.value="";
	$scope.advanceSearch.cardLastFour.useLike=true;
	$scope.advanceSearch.cardLastFour.caseIgnore=true;

	$scope.resultCount = 0;
	$scope.advanceSearch.tidName={};	
	$scope.advanceSearch.tidName.param="tidName";
	$scope.advanceSearch.tidName.value="";
	$scope.advanceSearch.tidName.useLike=true;
	$scope.advanceSearch.tidName.caseIgnore=true;
	
	$scope.advanceSearch.ipAddress={};	
	$scope.advanceSearch.ipAddress.param="ipAddress";
	$scope.advanceSearch.ipAddress.value="";
	$scope.advanceSearch.ipAddress.useLike=true;
	$scope.advanceSearch.ipAddress.caseIgnore=true;
	$scope.MAXDOWNLOADSIZE = 50000;
	
	$scope.advanceSearch.paramList = [$scope.advanceSearch.ipAddress,$scope.advanceSearch.cardFirstSix,$scope.advanceSearch.cardLastFour,$scope.advanceSearch.tidName,$scope.advanceSearch.creditCardName]

	$scope.requestReportParam = {};
	
	$scope.GroupId;
	$scope.getGroupId = function(){
		return sessionStorage.getItem("groupId").toLowerCase();
	}	
	
	angular.copy(commonQueryService.paymentStatus,$scope.paymentStatus);

	$scope.prepareAdvanceSearchParameter = function(){
		var list = [];
		for (var i=0; i <  $scope.advanceSearch.paramList.length ;++i){
			if($scope.advanceSearch.paramList[i].value != "")
				list.push($scope.advanceSearch.paramList[i])
		}
		return list;
	}
	
	$scope.prepareFilterParameter = function(){
		var filterList= {};
		var minMaxList = [];
		angular.copy(reportFilterService.selected,filterList);
		filterList.merchantIdList=commonQueryService.convertToArrayOfString(filterList.merchantIdList,'actualValue');
		filterList.bankIdList=commonQueryService.convertToArrayOfString(filterList.bankIdList,'actualValue');
		minMaxList.push(filterList.amount.min);
		minMaxList.push(filterList.amount.max);
		filterList.amount = minMaxList;
		return filterList;
	}
	
	$scope.reSort	=	function(column) {
		if ($scope.sortColumn == column)
			$scope.Reverse=!$scope.Reverse;
		else
			$scope.sortColumn=column;
	}

	$scope.requestReport2 = function(fileFormat) {
		$scope.advanceSearch.dismissAdvanceSearch();

console.log('Into requestReport line 689....');
		
		$scope.GroupId=$scope.getGroupId();
		console.log($scope.GroupId);
		
		if($scope.GroupId == 'amazonlive' || $scope.GroupId == 'amazon' || $scope.GroupId == 'snapdeal' || $scope.GroupId == 'acttv' ) $scope.MAXDOWNLOADSIZE=100000;
		console.log($scope.MAXDOWNLOADSIZE);
		if ($scope.resultCount <= $scope.MAXDOWNLOADSIZE)
			{
			$scope.placeRequest($scope.requestReportParam,fileFormat);
			return;
			}
		//If the count is > 50000 then display appropriate message to the user
		var displayInfo ={};
		displayInfo.title = 'Report results exceed the set limit';
		displayInfo.message = 'Please filter your search and regenerate the report.';
		displayInfo.status = 'WARNING';
		displayInfo.resultCount = $scope.resultCount;
		displayInfo.MAXDOWNLOADSIZE = $scope.MAXDOWNLOADSIZE;
		$scope.showReportRequestFeedback(displayInfo);
	}
	

	
	$scope.placeRequest = function (requestReportParam , fileFormat){
		var data = {
						"reportType":"PG_QUERY_PAYMENT2",
						"fileFormat":fileFormat,
						"param":{
								"fromTimestamp":requestReportParam.fromTimestamp,
								"toTimestamp":requestReportParam.toTimestamp,
								"searchString":requestReportParam.searchString,
								"advanceParamList":requestReportParam.advanceParamList,
								"filterList":requestReportParam.filterList
								}
					};
		console.log('Before calling reportRequest....');
        console.log(JSON.stringify(data));

		sharedDataService
				.loadData(
						'/services/query/requestReport',
						'POST',
						data,
						'',
						'',
						function(response) {
							var displayInfo ={};
							displayInfo.MAXDOWNLOADSIZE = $scope.MAXDOWNLOADSIZE;
							if(response == 'Request Failed')
								{
								displayInfo.title = 'Sorry, we are not able to process your request right now';
								displayInfo.message = 'Please contact your system support team for assistance.';
								displayInfo.status = 'ERROR';
								displayInfo.resultCount = -1;
								}
							else if(response == 'SUCCESS'){
								displayInfo.title = 'Report queued for downloading';
								displayInfo.message = '';
								displayInfo.status = response;
								displayInfo.resultCount = $scope.resultCount;
								}
							else if(response == 'WARNING'){
								displayInfo.title = 'Your current download requests are being processed. Please try after some time.';
								displayInfo.message = 'Please try after some time.';
								displayInfo.status = response;
								displayInfo.resultCount = -1;
								}
							else if(response == 'WARNING2'){
								displayInfo.title = 'Sorry, you have reached your daily limit on reports.';
								displayInfo.message = 'Please try tomorrow.';
								displayInfo.status = response;
								displayInfo.resultCount = -1;
								}
							$scope.showReportRequestFeedback(displayInfo);
						}
						)};
	
	$scope.loadData = function(searchString, from, to ,advanceSearchParameter ,filterList ,pageNo ,pageSize) {
		$scope.isSearching = true;
		$scope.advanceSearch.hideAdvanceSearchPopover();
		var data = {
				"fromTimestamp":from,
				"toTimestamp":to,
				"searchString":searchString,
				"advanceParamList":advanceSearchParameter,
				"filterList":filterList,
				"pageNo":pageNo,
				"pageSize":pageSize
				};
		console.log(JSON.stringify(data));
		sharedDataService
				.loadData(
						'/services/query/fetchReportData2',
						'POST',
						data,
						'refTableLoader',
						'refTable',
						function(dataResponse) {
							$scope.rows=dataResponse['data'];
							if(dataResponse['size'] > -1)
								{
								$scope.resultCount = dataResponse['size'];
								$scope.resetPagination();
								}
							$scope.currentView= $scope.rows;
							angular.copy(data,$scope.requestReportParam);
							$scope.isSearching = false;
							$scope.advanceSearch.dismissAdvanceSearch();
							console.log($scope.rows);
								});
	};
	
	$scope.retrievePage = function() {
		var	advanceSearchParameter = $scope.prepareAdvanceSearchParameter();
		var filterList=$scope.prepareFilterParameter();
		$scope.loadData($scope.searchValue,reportFilterService.dateRange.startDate,
				reportFilterService.dateRange.endDate,
				advanceSearchParameter,filterList ,$scope.pagination.page, $scope.pagination.perPage );
		}
	
	$scope.initiateSearch = function(paginationChange) {
		if(paginationChange && $scope.currentView.length == 0)return;
		$scope.initiated = true;
		$scope.pagination.page = 0;
		$scope.retrievePage();
	}
	
	
	$scope.populateHeaders = function (header) {
		$scope.merchantDetailHeader=header.MERCHANTDETAIL;
		$scope.paymentDetailHeaderCard=header.PAYMENTDETAIL;
		$scope.paymentDetailHeader= _.cloneDeep(header.PAYMENTDETAIL);
			_.remove($scope.paymentDetailHeader, function(item) {
			  return ( item.fieldName == 'maskedCardNumber' || item.fieldName == 'cardHolderName');
		});
		$scope.sourceDetailHeader=header.SOURCEDETAIL;
		$scope.settlementDetailHeader=header.SETTLEMENTDETAIL;
		$scope.searchResultHeader=header.SEARCHRESULT;
		$scope.refundDetailHeader=header.REFUNDDETAIL;
		$scope.postingDetailHeader=header.POSTINGDETAIL;
	}
	
	$scope.getPaymentDetailHeader = function(isCard){
		if( isCard )
			return $scope.paymentDetailHeaderCard;
		else
			return $scope.paymentDetailHeader;
	}
	
	$scope.resetPagination = function () {
		$scope.pagination.page=0;
		$scope.pagination.numPages = Math.ceil($scope.resultCount/$scope.pagination.perPage);
		$scope.pagination.firstPage=0;
		$scope.pagination.selectRange=[];
		var upperLimit = 5;
		$scope.pagination.lastPage=$scope.pagination.numPages-1;
		$scope.pagination.visibleLimit=($scope.pagination.numPages< $scope.pagination.upperLimit ? $scope.pagination.numPages : $scope.pagination.upperLimit);
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.firstPage);
		
	}
	
	$scope.pagination.createRangeList = function ( min  ){
		var list = [];
		for(var i= min ; i < min + $scope.pagination.visibleLimit   ;i++) {
			list.push(i);
			}
		return list;
	}
	
	$scope.pagination.goFirst = function () {
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.firstPage);
		$scope.pagination.page = $scope.pagination.firstPage;
		$scope.retrievePage();
	}

	$scope.pagination.goLast = function () {
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.lastPage-$scope.pagination.visibleLimit+1 );
		$scope.pagination.page = $scope.pagination.lastPage;
		$scope.retrievePage();
	}

	$scope.pagination.toPage = function (pageNo) {
		$scope.pagination.page = pageNo;
		$scope.retrievePage();
	}
	
	$scope.pagination.goLeft = function () {
		if($scope.pagination.selectRange[0] == $scope.pagination.page)
			{
				$scope.pagination.selectRange.pop();
				$scope.pagination.page = $scope.pagination.page - 1;
				$scope.pagination.selectRange.unshift($scope.pagination.page);
			}
		else
			{
			$scope.pagination.page = $scope.pagination.page - 1;
			}
		$scope.retrievePage();
	}
	
	$scope.pagination.goRight = function () {
		if($scope.pagination.selectRange[$scope.pagination.visibleLimit-1] == $scope.pagination.page)
			{
				$scope.pagination.selectRange.shift();
				$scope.pagination.page = $scope.pagination.page + 1;
				$scope.pagination.selectRange.push($scope.pagination.page);
			}
		else
			{
			$scope.pagination.page = $scope.pagination.page + 1;
			}
		$scope.retrievePage();
	}
	
	$scope.selectRow = function(id) {
		if($scope.selectedRow != id){
		//console.log('row selected',$scope.selectedRow,id);
		$scope.selectedRow=id;
	}
		else{	
			//console.log('row Deselected',$scope.selectedRow,id);
			$scope.selectedRow="";
	}
		
		
	}
	
	$scope.isSelected = function(id) {
		//console.log('checking selected',id,$scope.selectedRow);
		if($scope.selectedRow == id ) return true;
		else return false;
	}
	
	
	$scope.setInitialUserInfo = function(dataResponse,searchPlaceHolder) {
		$scope.populateHeaders(dataResponse.headerInfo);
		$scope.searchPlaceHolder = searchPlaceHolder;
		$scope.reSort('txnTime');
		$scope.pagination.rowPerPageOption=[10,20,50];
		$scope.pagination.upperLimit=5;
		reportFilterService.user = dataResponse.filterInfo;
		reportFilterService.user.amount={min:NaN,max:NaN};
	}
	
	commonQueryService.getInitialUserInfo($scope.setInitialUserInfo);	
	
	$scope.openFilter = function(){
		$modal.open({
		      templateUrl: 'static/partials/Transaction/modalFilter.html',
	      controller: 'reportFilterController',
	      size: 'lg',
	      resolve: {
		    	  scopeReport : function() {
		    		  return $scope;
	      }
		}
	      
	    });
	}

	$scope.showReportRequestFeedback = function(displayInfo){
		$modal.open({
		      templateUrl: 'static/partials/Transaction/reportRequestFeedback.html',
	      controller: 'reportRequestFeedbackController',
	      resolve: { displayInfo : function(){return displayInfo;}    
	      }
	    });
	}
	
	$scope.advanceSearch.toggleAdvanceSearch = function(){
		$scope.advanceSearch.isOpen = !$scope.advanceSearch.isOpen;
		if ($scope.advanceSearch.isOpen)$('#advanceSearch').popover('show');
		else {
			$scope.advanceSearch.dismissAdvanceSearch();
		}
	}
	
	$scope.advanceSearch.hideAdvanceSearchPopover = function(){
		$scope.advanceSearch.isOpen = false;
		$('#advanceSearch').popover('hide');
	}
	
	$scope.advanceSearch.dismissAdvanceSearch = function(){
			$scope.advanceSearch.hideAdvanceSearchPopover();
			$scope.advanceSearch.ipAddress.value="";
			$scope.advanceSearch.tidName.value="";
			$scope.advanceSearch.creditCardName.value="";
			$scope.advanceSearch.cardFirstSix.value="";
			$scope.advanceSearch.cardLastFour.value="";
	}

}


//acntno end
function downloadTabController($scope, sharedDataService ,$http ,$location,reportFilterService){

	$scope.moment = function(date) {
		return moment(date).unix() * 1000;
	}
	
	$scope.selectedReport = [];
	$scope.header = [
                 {fieldName:"id",fieldHeader:"REQUEST ID"},
                 {fieldName:"requestTime",fieldHeader:"REQUEST TIME"},
                 {fieldName:"reportDesc",fieldHeader:"REPORT TYPE"},
                 {fieldName:"status",fieldHeader:"STATUS"},
                 ]

$scope.rows=[];

$scope.loadData = function() {
	sharedDataService
			.loadData(
					'/services/query/getReportStatus',
					'GET',
					"",
					'refTableLoader',
					'refTable',
					function(dataResponse) {
						$scope.rows=dataResponse;
					});
}

$scope.removeSelected = function(){
	sharedDataService
	.loadData(
			'/services/query/removeReport',
			'POST',
			$scope.selectedReport,
			'refTableLoader',
			'refTableLoader',
			function() {
				$scope.selectedReport = [];
				$scope.loadData();
					});	
}

$scope.isComplete = function(reportStatus){
	if(reportStatus == reportFilterService.status.COMPLETE)return true;
	else return false;
}

$scope.getFileURL = function(fileName){
    return (sharedDataService.getBaseContext() + '/services/query/downloadFile/'+fileName);
}

$scope.isDownloading = function(fileName){
	if( $scope.downloadList.indexOf(fileName) > -1)return true;
	else return false;
}

$scope.loadData();

} 
//Query
function transactionDatePicker($scope, $interval, commonQueryService) {
	$scope.commonService = commonQueryService;
	if( $scope.viewType == commonService.viewType.QUERY ){
	$scope.date = {
        startDate: moment().subtract("days", 89).hour(0).minute(0).second(0),
        endDate: moment().second(0)
    };
	}
	else if ($scope.viewType == commonService.viewType.REFUND || $scope.viewType == commonService.viewType.SETTLEMENT){
		$scope.date = {
		        startDate: moment().subtract("days", 7).second(0),
		        endDate: moment().second(0)
	};
	}
	else{
		$scope.date = {
		        startDate: moment().subtract("days", 0).hour(0).minute(0).second(0),
		        endDate: moment().second(0)
		    };
	}
    $scope.open = function(){
    	$("#daterangebox").trigger("click");
    }
    
    $scope.minDate = moment().subtract('year', 1).startOf('month');
    $scope.maxDate = moment();
     
    if( $scope.viewType == commonService.viewType.QUERY || $scope.viewType == commonService.viewType.REPORT){
    $scope.opts = {
 		timePicker : true,
	    timePickerIncrement : 30,  
		minDate : $scope.minDate,
		maxDate : $scope.maxDate,
		dateLimit : {months : 3},
        locale: {
        	format: 'YYYY-MM-DD h:mm A',
            applyClass: 'btn-green',
            applyLabel: "Apply",
            fromLabel: "From",
            toLabel: "To",
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            firstDay: 1,
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        ranges: {
            'Today': [moment().hour(0).minute(0).second(0), moment().add('days', 1).hour(0).minute(0).second(0)],
            'Yesterday': [moment().subtract('days', 1).hour(0).minute(0).second(0), moment().hour(0).minute(0).second(0)],
            'Last Week': [moment().subtract(1, 'weeks').startOf('week').hour(0).minute(0).second(0), moment().subtract(1, 'weeks').endOf('week').hour(0).add('days', 1).minute(0).second(0)],
            'This Month': [moment().startOf('month').hour(0).minute(0).second(0), moment().endOf('month').add('days', 1).hour(0).minute(0).second(0)],
            'Last Month': [moment().subtract('month', 1).startOf('month').hour(0).minute(0).second(0), moment().subtract('month', 1).endOf('month').add('days', 1).hour(0).minute(0).second(0)]
         }
        };
    }
    else {
    	 $scope.opts = {
    				minDate : $scope.minDate,
    				maxDate : $scope.maxDate,
    				dateLimit : {months : 3},
    		        locale: {
    		        	format: 'YYYY-MM-DD',
    		            applyClass: 'btn-green',
    		            applyLabel: "Apply",
    		            fromLabel: "From",
    		            toLabel: "To",
    		            cancelLabel: 'Cancel',
    		            customRangeLabel: 'Custom',
    		            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
    		            firstDay: 1,
    		            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    		        },
    		        ranges: {
    		            'Today': [moment(), moment()],
    		            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
    		            'Last Week': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')],
    		            'This Month': [moment().startOf('month'), moment().endOf('month')],
    		            'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
    		         }
    		        };
    }
    //Watch for date changes
    $scope.$watch('date', function(newDate) {
        console.log('New date set: ', newDate);
        if($scope.viewType == commonService.viewType.QUERY)
        	commonService.setQueryDateTime(newDate);
        else if($scope.viewType == commonService.viewType.REPORT)
        	commonService.setReportDateTime(newDate);
    }, false);

}
// BankQuery
function transactionDatePickerBank($scope, $interval, commonQueryService) {
	$scope.commonService = commonQueryService;
	$scope.maxDays = 7;
	if( $scope.viewType == commonService.viewType.QUERY){
	$scope.date = {
        startDate: moment().subtract("days", 3).hour(0).minute(0).second(0),
        endDate: moment().second(0)
    };
	}
	else{
		$scope.date = {
		        startDate: moment().subtract("days", 0).hour(0).minute(0).second(0),
		        endDate: moment().second(0)
		    };
	}
    $scope.open = function(){
    	$("#daterangebox").trigger("click");
    }
    
    $scope.minDate = moment().subtract('year', 1).startOf('month');
    $scope.maxDate = moment();
    
    $scope.opts = {
		timePicker : true,
        timePickerIncrement : 30,    
		minDate : $scope.minDate,
		maxDate : $scope.maxDate,
		dateLimit : {days : $scope.maxDays},
        locale: {
        	format: 'YYYY-MM-DD h:mm A',
            applyClass: 'btn-green',
            applyLabel: "Apply",
            fromLabel: "From",
            toLabel: "To",
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            firstDay: 1,
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        ranges: {
            'Today': [moment().hour(0).minute(0).second(0), moment().add('days', 1).hour(0).minute(0).second(0)],
            'Yesterday': [moment().subtract('days', 1).hour(0).minute(0).second(0), moment().hour(0).minute(0).second(0)],
            'Last Week': [moment().subtract(1, 'weeks').startOf('week').hour(0).minute(0).second(0), moment().subtract(1, 'weeks').endOf('week').hour(0).add('days', 1).minute(0).second(0)],
            'This Month': [moment().startOf('month').hour(0).minute(0).second(0), moment().endOf('month').add('days', 1).hour(0).minute(0).second(0)],
            'Last Month': [moment().subtract('month', 1).startOf('month').hour(0).minute(0).second(0), moment().subtract('month', 1).endOf('month').add('days', 1).hour(0).minute(0).second(0)]
         }
        };
    
    //Watch for date changes
    $scope.$watch('date', function(newDate) {
        console.log('New date set: ', newDate);
        if($scope.viewType == commonService.viewType.QUERY)
        	commonService.setQueryDateTime(newDate);
        else if($scope.viewType == commonService.viewType.REPORT || $scope.viewType == commonService.viewType.DAILYQUERY)
        	commonService.setReportDateTime(newDate);
    }, false);

}
// BankDailyQuery
function transactionDatePickerBankReport($scope, $interval, commonQueryService) {
	$scope.commonService = commonQueryService;
	$scope.maxDays = 1;
	$scope.date = {
	    startDate: moment().hour(0).minute(0).second(0),
	    endDate: moment().second(0)
	}
    $scope.open = function(){
    	$("#daterangebox").trigger("click");
    }
    
    $scope.minDate = moment().subtract('year', 1).startOf('month');
    $scope.maxDate = moment();
    
    $scope.opts = {
    	timePicker: true,
    	timePickerIncrement: 30,
		minDate : $scope.minDate,
		maxDate : $scope.maxDate,
		dateLimit : {days : $scope.maxDays},
        locale: {
			format: 'YYYY-MM-DD h:mm A',
            applyClass: 'btn-green',
            applyLabel: "Apply",
            fromLabel: "From",
            toLabel: "To",
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            firstDay: 1,
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        ranges: {
            'Today': [moment().hour(0).minute(0).second(0), moment().add(1,'days').hour(0).minute(0).second(0)],
            'Yesterday': [moment().subtract(1,'days').hour(0).minute(0).second(0), moment().hour(0).minute(0).second(0)]
         }
        };
    
    //Watch for date changes
    $scope.$watch('date', function(newDate) {
        console.log('New date set: ', newDate);
        if($scope.viewType == commonService.viewType.QUERY) {
        	commonService.setQueryDateTime(newDate);
        }
        else if($scope.viewType == commonService.viewType.REPORT) {
        	commonService.setReportDateTime(newDate);
        }
        else if ($scope.viewType == commonService.viewType.DAILYQUERY) {
        	commonService.setReportDateTime(newDate);
        }
    }, false);

}

function generalQueryController($scope, $http, $modal, $filter, $location, sharedDataService , Pagination , queryFilterService, commonQueryService, User, RenderLogic){
	queryFilterService.clearSelectedFilter();
	queryFilterService.setBackendFilter();

	// Injecting rendr login into scope
	$scope.r = RenderLogic.r;
	$scope.sourceId=[];
	$scope.commonService = commonQueryService;
	$scope.queryConfig = User.getQueryFeature();
	$scope.isSearching = false;
	$scope.paymentStatus ={};
	$scope.searchPlaceHolder = "";
	$scope.queryFilterService = queryFilterService;
	$scope.tags=['first','second'];
	$scope.pagination = Pagination.getNew(10);
	$scope.Reverse=true;
	$scope.from = from;
	$scope.to = to;
	$scope.searchValue = "";
	$scope.selectedRow="";
	$scope.pagination.rowPerPageOption="";
	$scope.pagination.firstPage="";
	$scope.pagination.lastPage="";
	$scope.pagination.selectRange="";
	$scope.pagination.visibleLimit="";
	$scope.advanceSearch={};
	$scope.advanceSearch.isOpen = false;
	$scope.advanceSearch.creditCardName={};	
	$scope.advanceSearch.creditCardName.param="creditCardName";
	$scope.advanceSearch.creditCardName.value="";
	$scope.advanceSearch.creditCardName.useLike=true;
	$scope.advanceSearch.creditCardName.caseIgnore=true;
	
	$scope.advanceSearch.tidName={};	
	$scope.advanceSearch.tidName.param="tidName";
	$scope.advanceSearch.tidName.value="";
	$scope.advanceSearch.tidName.useLike=true;
	$scope.advanceSearch.tidName.caseIgnore=true;
	
	$scope.advanceSearch.ipAddress={};	
	$scope.advanceSearch.ipAddress.param="ipAddress";
	$scope.advanceSearch.ipAddress.value="";
	$scope.advanceSearch.ipAddress.useLike=true;
	$scope.advanceSearch.ipAddress.caseIgnore=true;

	$scope.advanceSearch.cardFirstSix={};	
	$scope.advanceSearch.cardFirstSix.param="cardFirstSix";
	$scope.advanceSearch.cardFirstSix.value="";
	$scope.advanceSearch.cardFirstSix.useLike=true;
	$scope.advanceSearch.cardFirstSix.caseIgnore=true;

	$scope.advanceSearch.cardLastFour={};	
	$scope.advanceSearch.cardLastFour.param="cardLastFour";
	$scope.advanceSearch.cardLastFour.value="";
	$scope.advanceSearch.cardLastFour.useLike=true;
	$scope.advanceSearch.cardLastFour.caseIgnore=true;



	$scope.advanceSearch.paramList = [$scope.advanceSearch.ipAddress,$scope.advanceSearch.cardFirstSix,$scope.advanceSearch.cardLastFour,$scope.advanceSearch.tidName,$scope.advanceSearch.creditCardName]

	angular.copy(commonQueryService.paymentStatus,$scope.paymentStatus);
	
	$scope.tempAmount = 1000;
	$scope.refund={};
	$scope.refund.selectedTransaction=[];
	$scope.refund.availableRefund={};
	$scope.refund.selectedRefund={};
	
	$scope.settlement={};
	$scope.settlement.selectedTransaction=[];
	$scope.sourceId = JSON.parse(sessionStorage.getItem('userData'))['IsSourceGroup'];
    console.log('length: '+$scope.sourceId.length + " $scope.sourceId "+$scope.sourceId);
	$scope.calculateRefundAmount = function(rows){
		$scope.refund.amount={};
		var tempRefundAmount = -1;
		var totalRefund = 0;
		var tempRefundData = null;
		var availableRefund = 0;
		for(var i=0;i < rows.length;++i){
			tempRefundData = rows[i].refundData;
			totalRefund = 0;
			if(tempRefundData != null)
				{
				for(var j=0;j < tempRefundData.length;++j){
					totalRefund = totalRefund + tempRefundData[j].amount;
				}
				}
			availableRefund = (rows[i].amount - rows[i].billercharges - totalRefund);
			console.log('available refund: '+availableRefund);
			$scope.refund.availableRefund[rows[i].txnRefNo] = availableRefund;
			$scope.refund.selectedRefund[rows[i].txnRefNo] = availableRefund;
		}
		
	}
	
	$scope.formatAmount = function(amount){
		return amount.toFixed(2);
	}
		
	$scope.refund.prepareRefundData = function(){
		var selectedRecord = $filter('extractRequestData')( $scope.refund.selectedTransaction ,queryFilterService.searchResult);
		var requestList =[];
		for (var i=0; i < selectedRecord.length ;++i){
			var current =selectedRecord[i];
		var refundData = {
				'mercid' : current.merchantId,
				'txnrefno' : current.txnRefNo,
				'txndate' : current.txndateid,
				'customerid' : current.ref1,
                'txnamountforui':$scope.formatAmount(current.amount),
				'txnamount' : $scope.formatAmount(current.amount - current.billercharges),
				'refundamount' : $scope.formatAmount($scope.refund.selectedRefund[current.txnRefNo]),
				'refundrefno' : 'NA'
		}
console.log('txnamnout'+refundData.txnamount);
console.log('refundamnout'+refundData.refundamount);

		requestList.push(refundData);
		}
		return requestList;
	}
	
	$scope.refund.openBatchRefund = function(){
		$scope.advanceSearch.dismissAdvanceSearch();
		$modal.open({
		      templateUrl: 'static/partials/Transaction/batchTransactionModal.html',
	      controller: 'batchTransactionController',
	      resolve: {
	    	  merchantIdList : function () {
		          return queryFilterService.user.merchantIdList;},
		      viewType: function(){
		    	  return commonQueryService.viewType.REFUND;
		      }
	      }
	      
	    });
	}
	
	$scope.settlement.openBatchSettlement = function(){
		$scope.advanceSearch.dismissAdvanceSearch();
		$modal.open({
		      templateUrl: 'static/partials/Transaction/batchTransactionModal.html',
	      controller: 'batchTransactionController',
	      resolve: {
	    	  merchantIdList : function () {
		          return queryFilterService.user.merchantIdList;},
		      viewType: function(){
		    	  return commonQueryService.viewType.SETTLEMENT;
		      }
	      }
	      
	    });
	}

	
	$scope.settlement.prepareSettlementData = function(){
		var selectedRecord = $filter('extractRequestData')( $scope.settlement.selectedTransaction ,queryFilterService.searchResult);
		var requestList =[];
		for (var i=0; i < selectedRecord.length ;++i){
			var current =selectedRecord[i];
		var settlementData = {
				'mercid' : current.merchantId,
				'txnrefno' : current.txnRefNo,
				'txndate' : current.txndateid,
				'customerid' : current.ref1,
				'txnamountforui':$scope.formatAmount(current.amount),
				'txnamount' : $scope.formatAmount(current.amount - current.billercharges),
				'mercrefno' : 'NA'
		}
		requestList.push(settlementData);
		}
		return requestList;
	}
	
	$scope.refund.isEnabled = function(availableRefundAmount ){
		if(availableRefundAmount>0)return true;
		else return false;
	}
	
	$scope.settlement.isEnabled = function(status){
		return (status != 'Y');
	}
	
	$scope.refund.resetRefundAmount = function(txnRefNo){
		$scope.refund.selectedRefund[txnRefNo]=	$scope.refund.availableRefund[txnRefNo];

		} 
	
	$scope.refund.checkAmount = function(txnRefNo,amount){
		if(typeof amount == 'undefined' || amount == null)
			{
			//$scope.refund.selectedRefund[txnRefNo] = $scope.refund.availableRefund[txnRefNo];
			var index = $scope.refund.selectedTransaction.indexOf(txnRefNo);
			if(index > -1)$scope.refund.selectedTransaction.splice(index , 1);
			return true;
			}
		else
			{
			return false;
			}
		}
	
	$scope.refund.clearSelectedRefund = function(){
		 $scope.refund.selectedTransaction = [];
	}
	
	$scope.settlement.clearSelectedSettlement = function(){
		 $scope.settlement.selectedTransaction = [];
	}
	
	$scope.refund.refundSelected = function(){
		$scope.advanceSearch.dismissAdvanceSearch();
		var requestList = $scope.refund.prepareRefundData();
		$modal.open({
		      templateUrl: 'static/partials/Transaction/refundModal.html',
	      controller: 'refundModalController',
	      backdrop:'static',
	      keyboard:false,
	      resolve: { refundData : function(){return requestList;},   
					scopeRefund : function(){return $scope;}
	      }
	    });
	}
	
	$scope.settlement.settleSelected = function(){
		$scope.advanceSearch.dismissAdvanceSearch();
		var requestList = $scope.settlement.prepareSettlementData();
		$modal.open({
		      templateUrl: 'static/partials/Transaction/settlementModal.html',
	      controller: 'settlementModalController',
	      backdrop:'static',
	      keyboard:false,
	      resolve: { settlementData : function(){return requestList;},   
					scopeSettlement : function(){return $scope;}
	      }
	    });

		console.log($scope.settlement.selectedTransaction);
	}
	

	
	$scope.prepareAdvanceSearchParameter = function(){
		var list = [];
		for (var i=0; i <  $scope.advanceSearch.paramList.length ;++i){
			if($scope.advanceSearch.paramList[i].value != "")
				list.push($scope.advanceSearch.paramList[i])
		}
		return list;
	}
	
	$scope.prepareFilterParameter = function(){
		var filterList= {};
		var minMaxList = [];
		angular.copy(queryFilterService.selected,filterList);
		filterList.merchantIdList=commonQueryService.convertToArrayOfString(filterList.merchantIdList,'actualValue');
		filterList.bankIdList=commonQueryService.convertToArrayOfString(filterList.bankIdList,'actualValue');
		minMaxList.push(filterList.amount.min);
		minMaxList.push(filterList.amount.max);
		filterList.amount = minMaxList;
		return filterList;
	}

	$scope.prepareBlankFilter = function(){
		 var filterList ={};
         var minMaxList = [];
		 filterList.merchantIdList=[];
		 filterList.bankIdList=[];
		 filterList.paymentCategoryList=[];
		 filterList.networkList=[];
		 filterList.paymentStatusList=[] ;
		 filterList.settlementStatusList=[] ;
		 filterList.uaDeviceCategoryList=[] ;
		 minMaxList.push(NaN);
         minMaxList.push(NaN);
		 filterList.amount=minMaxList;
	     return filterList;
	}

	$scope.reSort	=	function(column) {
		if ($scope.sortColumn == column)
			$scope.Reverse=!$scope.Reverse;
		else
			$scope.sortColumn=column;
	}

	$scope.loadData = function(searchString, from, to ,advanceSearchParameter ,filterList) {
		$scope.isSearching = true;
		$scope.advanceSearch.hideAdvanceSearchPopover();
		var data = {
				"fromTimestamp":from,
				"toTimestamp":to,
				"searchString":searchString,
				"advanceParamList":advanceSearchParameter,
				"filterList":filterList
				};
		console.log(JSON.stringify(data));
		sharedDataService
				.loadData(
						'/services/query/generalSearch',
						'POST',
						data,
						'refTableLoader',
						'refTable',
						function(dataResponse) {
							if (dataResponse['data'] == null)
								$scope.rows=[];
							else
								{
								$scope.rows=dataResponse['data'];
								}
							var size = dataResponse['size'];
							queryFilterService.searchResult=$scope.rows;
							$scope.calculateRefundAmount($scope.rows);
							queryFilterService.currentView=queryFilterService.searchResult;
							console.log($scope.rows);
							$scope.isSearching = false;
							$scope.advanceSearch.dismissAdvanceSearch();
							if(size>500)
								{
									$scope.showLimitExceedWarning();
								}
								});
	};
	
	$scope.setTxnStatusList = function ( filterList){
		if($scope.viewType != commonQueryService.viewType.QUERY){
			filterList.paymentStatusList = [commonQueryService.paymentStatus.SUCCESS];
		}
	}
	
	$scope.getData = function() {
		$scope.initiated = true;
		var	advanceSearchParameter = $scope.prepareAdvanceSearchParameter();
		var filterList= $scope.prepareBlankFilter();
		if(queryFilterService.useBackendFilter)
			{
			filterList=$scope.prepareFilterParameter();
			queryFilterService.resetBackendFilter();
			}
		else
			{
			queryFilterService.clearSelectedFilter();
			}
		$scope.setTxnStatusList(filterList);
		$scope.loadData($scope.searchValue,queryFilterService.dateRange.startDate,queryFilterService.dateRange.endDate,advanceSearchParameter,filterList);
		}
	
	
	$scope.populateHeaders = function (header) {
		$scope.merchantDetailHeader=header.MERCHANTDETAIL;
		$scope.paymentDetailHeaderCard=header.PAYMENTDETAIL;
		$scope.paymentDetailHeader= _.cloneDeep(header.PAYMENTDETAIL);
		_.remove($scope.paymentDetailHeader, function(item) {
		  return item.fieldName == 'maskedCardNumber';
		});
		$scope.sourceDetailHeader=header.SOURCEDETAIL;
		$scope.settlementDetailHeader=header.SETTLEMENTDETAIL;
		$scope.searchResultHeader=header.SEARCHRESULT;
		$scope.refundDetailHeader=header.REFUNDDETAIL;
		$scope.postingDetailHeader=header.POSTINGDETAIL;
	}
	
	$scope.getPaymentDetailHeader = function(isCard){
		if( isCard )
			return $scope.paymentDetailHeaderCard;
		else
			return $scope.paymentDetailHeader;
	}
	
	$scope.resetPagination = function () {
		$scope.pagination.page=0;
		$scope.pagination.numPages = Math.ceil(queryFilterService.currentView.length/$scope.pagination.perPage);
		$scope.pagination.firstPage=0;
		$scope.pagination.selectRange=[];
		var upperLimit = 5;
		$scope.pagination.lastPage=$scope.pagination.numPages-1;
		$scope.pagination.visibleLimit=($scope.pagination.numPages< $scope.pagination.upperLimit ? $scope.pagination.numPages : $scope.pagination.upperLimit);
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.firstPage);
		
	}
	
	$scope.pagination.createRangeList = function ( min  ){
		var list = [];
		for(var i= min ; i < min + $scope.pagination.visibleLimit   ;i++) {
			list.push(i);
			}
		return list;
	}
	
	$scope.pagination.goFirst = function () {
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.firstPage);
		$scope.pagination.toPageId($scope.pagination.firstPage);
	}

	$scope.pagination.goLast = function () {
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.lastPage-$scope.pagination.visibleLimit+1 );
		$scope.pagination.toPageId($scope.pagination.lastPage);
	}
	
	$scope.pagination.goLeft = function () {
		if($scope.pagination.selectRange[0] == $scope.pagination.page)
			{
				$scope.pagination.selectRange.pop();
				$scope.pagination.prevPage();
				$scope.pagination.selectRange.unshift($scope.pagination.page);
			}
		else
			{
				$scope.pagination.prevPage();
			}
	}
	
	$scope.pagination.goRight = function () {
		if($scope.pagination.selectRange[$scope.pagination.visibleLimit-1] == $scope.pagination.page)
			{
				$scope.pagination.selectRange.shift();
				$scope.pagination.nextPage();
				$scope.pagination.selectRange.push($scope.pagination.page);
			}
		else
			{
				$scope.pagination.nextPage();
			}
	}
		
	$scope.selectRow = function(id) {
		if($scope.selectedRow != id){
		//console.log('row selected',$scope.selectedRow,id);
		$scope.selectedRow=id;
	}
		else{	
			//console.log('row Deselected',$scope.selectedRow,id);
			$scope.selectedRow="";
	}
		
		
	}
	
	$scope.isSelected = function(id) {
		//console.log('checking selected',id,$scope.selectedRow);
		if($scope.selectedRow == id ) return true;
		else return false;
	}
	
	

    $scope.$watch(function () {
    return queryFilterService.currentView;
}, 
      function(newVal, oldVal) {
	//alert('changed');
	$scope.currentView = newVal;
	$scope.resetPagination();
	//console.log(newVal);
    //console.log(oldVal);
    }, true);
    
	$scope.setInitialUserInfo = function(dataResponse ,searchPlaceHolder) {
		$scope.populateHeaders(dataResponse.headerInfo);
		$scope.searchPlaceHolder = searchPlaceHolder;
		$scope.reSort('txnTime');
		$scope.pagination.rowPerPageOption=[10,20,50];
		$scope.pagination.upperLimit=5;
		queryFilterService.user = dataResponse.filterInfo;
		queryFilterService.user.amount={min:NaN,max:NaN};
		queryFilterService.clearResult();
		//console.log(dataResponse);
	}
	
	commonQueryService.getInitialUserInfo($scope.setInitialUserInfo);
		
	$scope.openFilter = function(){
		$modal.open({
		      templateUrl: 'static/partials/Transaction/modalFilter.html',
	      controller: 'queryFilterController',
	      size: 'lg',
	      resolve: {
	    	  scopeQuery : function() {return $scope;}
	      }
	      
	    });
	}

	$scope.showLimitExceedWarning = function(){
		$modal.open({
		      templateUrl: 'static/partials/Transaction/limitExceeded.html',
	      controller: 'limitExceedModalController',
	      resolve: {
	    	  viewType: function () {
		          return commonQueryService.viewType.QUERY;
	      },
		scopeQuery : function() {return $scope;}

	      }
	      
	    });
	}
	
	$scope.advanceSearch.toggleAdvanceSearch = function(){
		$scope.advanceSearch.isOpen = !$scope.advanceSearch.isOpen;
		if ($scope.advanceSearch.isOpen)$('#advanceSearch').popover('show');
		else {
			$scope.advanceSearch.dismissAdvanceSearch();
		}
		//console.log('Advance Search');
	}
	
	$scope.advanceSearch.hideAdvanceSearchPopover = function(){
		$scope.advanceSearch.isOpen = false;
		$('#advanceSearch').popover('hide');
	}
	
	$scope.advanceSearch.dismissAdvanceSearch = function(){
		$scope.advanceSearch.hideAdvanceSearchPopover();
		$scope.advanceSearch.ipAddress.value="";
		$scope.advanceSearch.cardFirstSix.value="";
		$scope.advanceSearch.cardLastFour.value="";
		$scope.advanceSearch.tidName.value="";
		$scope.advanceSearch.creditCardName.value="";
		}
	
}



function limitExceedModalController($scope,$modal,$modalInstance,queryFilterService,scopeQuery){
	$scope.openFilter = function(){
		queryFilterService.setBackendFilter();
		$modalInstance.close();
		$modal.open({
		      templateUrl: 'static/partials/Transaction/modalFilter.html',
	      controller: 'queryFilterController',
	      size: 'lg',
	      resolve: {
	    	  scopeQuery : function() {return scopeQuery;}
	      }
	      
	    });
	}
	$scope.close = function(){
		$modalInstance.close();
	}

}

function bankLimitExceedModalController($scope,$modal,$modalInstance,queryFilterService,scopeQuery){
	$scope.openFilter = function(){
		queryFilterService.setBackendFilter();
		$modalInstance.close();
		$modal.open({
			templateUrl: 'static/partials/Transaction/bankModalFilter.html',
			controller: 'queryFilterController',
			size: 'lg',
			resolve: {
				scopeQuery : function() {return scopeQuery;}
			}
		
		});
	}
	$scope.close = function(){
		$modalInstance.close();
	}
	
}

function reportRequestFeedbackController($scope,$modalInstance ,displayInfo){
	$scope.title = displayInfo.title;
	$scope.message = displayInfo.message;
	$scope.status = displayInfo.status;
	$scope.resultCount = displayInfo.resultCount;
	$scope.messageStyle ={};
	$scope.MAXDOWNLOADSIZE = displayInfo.MAXDOWNLOADSIZE; 
	$scope.messageStyle['SUCCESS']=
		{
			"color":"green"
		};
	
	$scope.messageStyle['WARNING']=
		{
			"color":"goldenrod"
		};
	$scope.messageStyle['ERROR']=
	{
			"color":"red"
	};
	
	
	
	
	$scope.close = function(){
		$modalInstance.close();
	}
}

function refundModalController($scope , $modalInstance , refundData ,sharedDataService, $filter , scopeRefund , queryFilterService, $route){
	
	$scope.refundData = refundData;
	
	$scope.displayHeader ={ 
			'preRefund' : [
	                 {fieldName:"txnrefno",fieldHeader:"Txn Ref No"},
	                 {fieldName:"txnamountforui",fieldHeader:"Txn Amount"},
	                 {fieldName:"refundamount",fieldHeader:"Refund Amount"}
	                 ],
			'postRefund' : [
	                 {fieldName:"txnrefno",fieldHeader:"Txn Ref No"},
	                 {fieldName:"refundamount",fieldHeader:"Refund Amount"},
	                 {fieldName:"status",fieldHeader:"Status"}
	                 ]
			}

	$scope.displayData ={
			'preRefund': refundData,
			'postRefund':[]
	}
	
	$scope.title = {
			'preRefund' : "Please review selected refunds",
			'inRefund' : "Initiating Refunds",
			'postRefund' : "Refunds have been initiated",

	}
	
	$scope.refundResponse =
	{
			submitted : 0,
			successful: 0,
			failed: 0
	};
	$scope.mercRefNo ="";
	
	$scope.initiateRefund = function(){
		$scope.activateInRefund();
		var data={
				'mercRefNo': $scope.merRefNo,
				'refundData': $scope.refundData
		}
		$scope.preRefund = false;
		sharedDataService
		.loadData(
				'/services/refund/initiateRefund',
				'POST',
				data,
				'refundTableLoader',
				'refundTable',
				function(dataResponse) {
					if(dataResponse == 'Request Failed'){
						$scope.activatePreRefund();
						return;
					}
					$scope.displayData['postRefund']  = $scope.prepareResponseData(dataResponse);
					$scope.activatePostRefund();
					console.log('Refund Initiated..');
						});
		}
	
	$scope.activatePostRefund= function(){
		$scope.activeView = 'postRefund';
	}	
	
	$scope.activatePreRefund = function(){
		$scope.activeView = 'preRefund';
	}
	
	$scope.activateInRefund = function(){
		$scope.activeView = 'inRefund';
	}


	$scope.isPreRefundViewActive = function(){
		return $scope.activeView == 'preRefund';
	}
	
	$scope.isPostRefundViewActive = function(){
		return $scope.activeView == 'postRefund';
	}
	
	$scope.close = function(){
		$modalInstance.close();
	}

	$scope.export = function(){
		var data = [];
		angular.copy($scope.displayData['postRefund'],data);
		var headerData = $scope.displayHeader['postRefund'];
		var csvContent = "";
		var header =  {
				'txnrefno' : headerData[0].fieldHeader,
				'refundamount' : headerData[1].fieldHeader, 
				'status' : headerData[2].fieldHeader};

		data.unshift(header);
		data.forEach(function(record, index){
		   var dataString = record.txnrefno+","+record.refundamount+","+ $scope.getStatusValue(record.status);
		   csvContent += index < data.length-1 ? dataString+ "|" : dataString;
	
		});
		var date = new Date();
		var timeStamp = date.toDateString() +"_"+date.getHours()+"hr_"+date.getMinutes()+"min";
		var fileName= "Online_refund_summary_"+timeStamp+".csv";
		queryFilterService.exportCSV(csvContent , fileName);
	}
	
	$scope.getStatusValue = function(code){
		if( code == 'Status')
			return code;
		if( code == 'N')
			return 'Failure';
		else
			return 'Success';
	}
	
	$scope.getValue = function(value, label){
		if(label == 'refundamount' || label == 'txnamount')
			return $filter('number')(value,2);
		else 
			return value; 
		console.log(value,label);
	}
	
	$scope.prepareResponseData = function(data){
		var resultList=[];
		for(var i=0;i< data.length ;++i){
			  var record=$filter('filter')( $scope.refundData , data[i].txnrefno)[0];
			  var newRecord = {
					  'txnrefno': record.txnrefno,
					  'refundamount' : record.refundamount,
					  'status' : data[i].status,
					  'error' : data[i].error
			  }
			  resultList.push(newRecord);
			  if(data[i].status != 'N')$scope.refundResponse.successful = $scope.refundResponse.successful+1;
			  else if(data[i].status == 'N')$scope.refundResponse.failed = $scope.refundResponse.failed+1;
		}
		$scope.refundResponse.submitted = data.length;
		return resultList;
	}
	
	$scope.backToRefund = function(){
		$route.reload();
	}
	
	$scope.activatePreRefund();

	}


function settlementModalController($scope , $modalInstance , settlementData ,sharedDataService, $filter , scopeSettlement , queryFilterService, $route){
	
	$scope.settlementData = settlementData;
	
	$scope.displayHeader ={ 
			'preSettlement' : [
	                 {fieldName:"txnrefno",fieldHeader:"Txn Ref No"},
	                 {fieldName:"txnamountforui",fieldHeader:"Amount"}
	                 ],
			'postSettlement' : [
	                 {fieldName:"txnrefno",fieldHeader:"Txn Ref No"},
	                 {fieldName:"txnamountforui",fieldHeader:"Amount"},
	                 {fieldName:"status",fieldHeader:"Status"}
	                 ]
			}

	$scope.displayData ={
			'preSettlement': settlementData,
			'postSettlement':[]
	}
	
	$scope.title = {
			'preSettlement' : "Please review selected settlements",
			'inSettlement' : "Initiating settlements",
			'postSettlement' : "Settlements have been initiated",

	}
	
	$scope.settlementResponse =
	{
			submitted : 0,
			successful: 0,
			failed: 0
	};
	$scope.mercRefNo ="";

	$scope.getValue = function(value, label){
		if(label == 'txnamount')
			return $filter('number')(value, 2);
		else 
			return value; 
		console.log(value,label);
	}

	
	$scope.initiateSettlement = function(){
		$scope.activateInSettlement();
		var data={
				'mercRefNo': $scope.merRefNo,
				'settlementData': $scope.settlementData
		}
		$scope.preSettlement = false;
		sharedDataService
		.loadData(
				'/services/settlement/initiateSettlement',
				'POST',
				data,
				'settlementTableLoader',
				'settlementTable',
				function(dataResponse) {
					if(dataResponse == 'Request Failed'){
						$scope.activatePreSettlement();
						return;
					}
					$scope.displayData['postSettlement']  = $scope.prepareResponseData(dataResponse);
					$scope.activatePostSettlement();
					console.log('Settlement Initiated..');
						});
		}
	
	$scope.activatePostSettlement= function(){
		$scope.activeView = 'postSettlement';
	}	
	
	$scope.activatePreSettlement = function(){
		$scope.activeView = 'preSettlement';
	}
	
	$scope.activateInSettlement = function(){
		$scope.activeView = 'inSettlement';
	}


	$scope.isPreSettlementViewActive = function(){
		return $scope.activeView == 'preSettlement';
	}
	
	$scope.isPostSettlementViewActive = function(){
		return $scope.activeView == 'postSettlement';
	}
	
	$scope.close = function(){
		$modalInstance.close();
	}

	$scope.export = function(){
		var data = [];
		angular.copy($scope.displayData['postSettlement'],data);
		var headerData = $scope.displayHeader['postSettlement'];
		var csvContent = "";
		var header =  {
				'txnrefno' : headerData[0].fieldHeader,
				'txnamount' : headerData[1].fieldHeader, 
				'status' : headerData[2].fieldHeader};

		data.unshift(header);
		data.forEach(function(record, index){
		   var dataString = record.txnrefno+","+record.txnamount+","+ $scope.getStatusValue(record.status);
		   csvContent += index < data.length-1 ? dataString+ "|" : dataString;
	
		});
		var date = new Date();
		var timeStamp = date.toDateString() +"_"+date.getHours()+"hr_"+date.getMinutes()+"min";
		var fileName= "Online_settlement_summary_"+timeStamp+".csv";
		queryFilterService.exportCSV(csvContent , fileName);
	}

	$scope.getStatusValue = function(code){
		if( code == 'Status')
			return code;
		if( code == 'N')
			return 'Failure';
		else
			return 'Success';
	}
	
	$scope.prepareResponseData = function(data){
		var resultList=[];
		for(var i=0;i< data.length ;++i){
			  var record=$filter('filter')( $scope.settlementData , data[i].txnrefno)[0];
			  var newRecord = {
					  'txnrefno': record.txnrefno,
					  'txnamount' : record.txnamount,
					  'status' : data[i].status,
					  'error' : data[i].error
			  }
			  resultList.push(newRecord);
			  if(data[i].status == 'Y')$scope.settlementResponse.successful = $scope.settlementResponse.successful+1;
			  else if(data[i].status == 'N')$scope.settlementResponse.failed = $scope.settlementResponse.failed+1;
		}
		$scope.settlementResponse.submitted = data.length;
		return resultList;
	}
	
	$scope.backToSettlement = function(){
		$route.reload();
	}
	
	$scope.activatePreSettlement();

	}


function batchTransactionController($scope, $modalInstance, merchantIdList , viewType, FileUploader,commonQueryService, sharedDataService, $rootScope, $timeout){
	console.log(merchantIdList);
	$scope.merchantIdList = _.sortBy( merchantIdList, 'actualValue' );
	$scope.selectedMerchantId = merchantIdList[0];
	var viewTypeEnum = commonQueryService.viewType;
	
	var api={};
	api[viewTypeEnum.SETTLEMENT]= '/services/settlement/batchSettlementUpload';
	api[viewTypeEnum.REFUND]= '/services/refund/batchRefundUpload';
		
	var title={};
		title[viewTypeEnum.SETTLEMENT]= 'Upload a Batch Settlement File';
		title[viewTypeEnum.REFUND]= 'Upload a Batch Refund File';
	
	$scope.title = title[viewType];
    var uploader = $scope.uploader = new FileUploader({
        url: sharedDataService.getBaseContext()+api[viewType],
        queueLimit: 2 
        
    });
    
    uploader.onAfterAddingFile = function(fileItem) {
    	if( uploader.queue.length > 1)uploader.removeFromQueue(0); 
    }
    	
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
    	if(response.status == 'Y'){
   		$scope.showPopUp("Uploaded Successfully!","Batch request placed","success");
    	}
    	else if(response.status == 'N'){
   		$scope.showPopUp("Failure!",response.error,"error");
    	}
    	else if(response.status == 'X'){
       		$scope.showPopUp("Upload Failed!","Please try again","error");
    }
    }
    
    uploader.onErrorItem = function(fileItem, response, status, headers) {
   		$scope.showPopUp("Upload Failed!","Please try again","error");
    	console.info('onErrorItem', fileItem, response, status, headers);
   		if(status == 403)$rootScope.logoutHandler(); //Immediately logout if session has expired
    };
    
    $scope.label=function (value) {
        return value.displayValue+"   ("+value.actualValue+")";
     }
    
    $scope.browseFile = function(){
    	$timeout(function() {$('#selectFile').trigger('click')}, 0, false);
    }
    
    $scope.initiateUpload = function(){
    	var fileItem = uploader.queue[0];
    	var mercId = $scope.selectedMerchantId.actualValue;
    	fileItem.formData = [];
    	fileItem.formData.push({'merchantId' : mercId});
    	fileItem.headers= {'X-CSRF-TOKEN' : sessionStorage.getItem('X-CSRF-TOKEN')};
    	var fileName= fileItem.file.name;
    	var patt= new RegExp("^[^_]+_[a-zA-Z0-9._-]*[.]txt$"); //Pattern for matching the file name
    	var result=patt.test(fileName);
    	result = result && (fileName.length <= 50);
    	if(result){
    		var fileMercid = fileName.substring(0,fileName.indexOf("_"));
    		if (fileMercid == mercId) fileItem.upload();
    		else $scope.showPopUp("Invalid MerchantId !","Please provide the same merchantId in the file name as the one you have selected.","warning");
    	}else{
    		$scope.showPopUp("Improper File Name Format","Filename format should be [merchantId]_[filename upto 50 characters].txt","warning");
    	}
    	console.log('Uploading..');
    	//uploader.queue[0].upload()
    }
    
    $scope.showPopUp = function(_title , _text , _type){
   		swal({
			title: _title,
			text: _text,
			type: _type
		},function (isConfirm) {
			if(isConfirm) {
				if(_type == "success"){
					$scope.close();
				}
			}
		});
    }
    
	$scope.close = function(){
		$modalInstance.close();
	}
	
}

function validationReportController($scope , $location,$filter, sharedDataService, commonQueryService ){
	var viewTypeEnum = commonQueryService.viewType;
	var viewType = null;
	if($location.$$path == '/refundDownloads')viewType = viewTypeEnum.REFUND;
	else if($location.$$path == '/settlementDownloads')viewType = viewTypeEnum.SETTLEMENT;
	$scope.rows=[];
	$scope.selectedReport = [];
	
	var reportApi={};
	reportApi[viewTypeEnum.SETTLEMENT]= '/services/settlement/validationReport';
	reportApi[viewTypeEnum.REFUND]= '/services/refund/validationReport';
	
	var downloadApi={};
	downloadApi[viewTypeEnum.SETTLEMENT]= '/services/settlement/downloadFile/';
	downloadApi[viewTypeEnum.REFUND]= '/services/refund/downloadFile/';
	
	var markDownloadApi={};
	markDownloadApi[viewTypeEnum.SETTLEMENT]= '/services/settlement/markValidationDownload';
	markDownloadApi[viewTypeEnum.REFUND]= '/services/refund/markValidationDownload';
	
	$scope.date = {
	        startDate: moment().subtract("days", 1),
	        endDate: moment()
	    };

	$scope.open = function(){
	    	$("#daterangebox").trigger("click");
	    }
	    
    $scope.minDate = moment().subtract('month', 3).startOf('month');
    $scope.maxDate = moment();
    
    $scope.opts = {
		minDate : $scope.minDate,
		maxDate : $scope.maxDate,
		dateLimit : {days : 1000},
        locale: {
        	format: 'YYYY-MM-DD',
            applyClass: 'btn-green',
            applyLabel: "Apply",
            fromLabel: "From",
            toLabel: "To",
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            firstDay: 1,
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last Week': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')]
         }
        };

	    //Watch for date changes
	    $scope.$watch('date', function(newDate) {
	    	console.log($scope.date);
	    	$scope.loadData();
	    }, false);
	
	$scope.loadData = function(){
		var data= {
				'from' : $scope.date.startDate.format('YYYYMMDD'),
				'to'   : $scope.date.endDate.format('YYYYMMDD')
		};
		sharedDataService
		.loadData(
				reportApi[viewType],
				'POST',
				data,
				'reportTableLoader',
				'reportTable',
				function(dataResponse) {
					if(dataResponse.status == 'N') return;
					$scope.selectedReport = [];
					$scope.rows = $filter('orderBy')(dataResponse.filenames,'reverse')
					console.log(dataResponse);
						});
		}
	$scope.loadData();
	

	$scope.getFileURL = function(fileName){
		return (sharedDataService.getBaseContext() + downloadApi[viewType]+fileName);
		}
	
	$scope.removeSelected = function(){
		var requestList = $scope.prepareReportData();
		console.log(requestList);
		sharedDataService
		.loadData(
				markDownloadApi[viewType],
				'POST',
				requestList,
				'reportTableLoader',
				'reportTable',
				function() {
					$scope.selectedReport = [];
					$scope.loadData();
						});	
	}
	
	$scope.prepareReportData = function(){
		var requestList =[];
		for(var i=0; i< $scope.selectedReport.length; ++i){
			var tempObj={
					'mercid':$scope.selectedReport[i].mercid,
					'filename':$scope.selectedReport[i].name
			}
			requestList.push(tempObj);
		}
		return requestList;
	}

}


function tidReportController($scope , $filter, sharedDataService){
	$scope.rows=[];
	$scope.selectedReport = [];
	
	$scope.date = {
	        startDate: moment().subtract("days", 1),
	        endDate: moment()
	    };

	$scope.open = function(){
	    	$("#daterangebox").trigger("click");
	    }
	    
    $scope.minDate = moment().subtract('month', 6).startOf('month');
    $scope.maxDate = moment();
    
    $scope.opts = {
		minDate : $scope.minDate,
		maxDate : $scope.maxDate,
		dateLimit : {days : 1000},
        locale: {
        	format: 'YYYY-MM-DD',
            applyClass: 'btn-green',
            applyLabel: "Apply",
            fromLabel: "From",
            toLabel: "To",
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            firstDay: 1,
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last Week': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')]
         }
        };

	    //Watch for date changes
	    $scope.$watch('date', function(newDate) {
	    	console.log($scope.date);
	    	$scope.loadData();
	    }, false);
	
	$scope.loadData = function(){
		var data= {
				'from' : $scope.date.startDate.format('YYYYMMDD'),
				'to'   : $scope.date.endDate.format('YYYYMMDD')
		};
		sharedDataService
		.loadData(
				'/services/settlement/tidReport',
				'POST',
				data,
				'reportTableLoader',
				'reportTable',
				function(dataResponse) {
					if(dataResponse.status == 'N') return;
					$scope.selectedReport = [];
					$scope.rows = $filter('orderBy')(dataResponse.filenames, 'tidDate', 'reverse')
					console.log(dataResponse);
						});
		}
	$scope.loadData();
	

	$scope.getFileURL = function(fileName){
		return (sharedDataService.getBaseContext() + '/services/settlement/downloadTidFile/'+fileName);
		}
	
	$scope.removeSelected = function(){
		var requestList = $scope.prepareReportData();
		console.log(requestList);
		sharedDataService
		.loadData(
				'/services/settlement/markTidDownload',
				'POST',
				requestList,
				'reportTableLoader',
				'reportTable',
				function() {
					$scope.selectedReport = [];
					$scope.loadData();
						});	
	}
	
	$scope.prepareReportData = function(){
		var requestList =[];
		for(var i=0; i< $scope.selectedReport.length; ++i){
			var tempObj={
					'mercid':$scope.selectedReport[i].mercid,
					'filename':$scope.selectedReport[i].name
			}
			requestList.push(tempObj);
		}
		return requestList;
	}

}

function settlementExceptionReportController($scope , $filter, sharedDataService){
	$scope.rows=[];
	$scope.selectedReport = [];
	
	$scope.date = {
	        startDate: moment().subtract("days", 1),
	        endDate: moment()
	    };

	$scope.open = function(){
	    	$("#daterangebox").trigger("click");
	    }
	    
    $scope.minDate = moment().subtract('month', 3).startOf('month');
    $scope.maxDate = moment();
    
    $scope.opts = {
		minDate : $scope.minDate,
		maxDate : $scope.maxDate,
		dateLimit : {days : 1000},
        locale: {
        	format: 'YYYY-MM-DD',
            applyClass: 'btn-green',
            applyLabel: "Apply",
            fromLabel: "From",
            toLabel: "To",
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            firstDay: 1,
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last Week': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')]
         }
        };

	    //Watch for date changes
	    $scope.$watch('date', function(newDate) {
	    	console.log($scope.date);
	    	$scope.loadData();
	    }, false);
	
	$scope.loadData = function(){
		var data= {
				'from' : $scope.date.startDate.format('YYYYMMDD'),
				'to'   : $scope.date.endDate.format('YYYYMMDD')
		};
		sharedDataService
		.loadData(
				'/services/settlement/settlementExceptionReport',
				'POST',
				data,
				'reportTableLoader',
				'reportTable',
				function(dataResponse) {
					$scope.rows = [];
					if(dataResponse.status == 'N') return;
					$scope.selectedReport = [];
					$scope.rows = $filter('orderBy')(dataResponse.filenames, 'Date', 'reverse')
					console.log("LOGGING dataresponses");
					console.log(dataResponse);
						});
		}
	$scope.loadData();
	

	$scope.getFileURL = function(fileName){
		return (sharedDataService.getBaseContext() + '/services/settlement/downloadsettlementExceptionFile/'+fileName);
		}
	
	$scope.removeSelected = function(){
		var requestList = $scope.prepareReportData();
		console.log(requestList);
		sharedDataService
		.loadData(
				'/services/settlement/marksettlementExceptionDownload',
				'POST',
				requestList,
				'reportTableLoader',
				'reportTable',
				function() {
					$scope.selectedReport = [];
					$scope.loadData();
						});	
	}
	
	$scope.prepareReportData = function(){
		var requestList =[];
		for(var i=0; i< $scope.selectedReport.length; ++i){
			var tempObj={
					'mercid':$scope.selectedReport[i].mercid,
					'filename':$scope.selectedReport[i].name
			}
			requestList.push(tempObj);
		}
		return requestList;
	}

}

function ARNReportController($scope , $filter, sharedDataService){
	$scope.rows=[];
	$scope.selectedReport = [];
	
	$scope.date = {
	        startDate: moment().subtract("days", 1),
	        endDate: moment()
	    };

	$scope.open = function(){
	    	$("#daterangebox").trigger("click");
	    }
	    
    $scope.minDate = moment().subtract('month', 12).startOf('month');
    $scope.maxDate = moment();
    
    $scope.opts = {
		minDate : $scope.minDate,
		maxDate : $scope.maxDate,
		dateLimit : {days : 1000},
        locale: {
            applyClass: 'btn-green',
            applyLabel: "Apply",
            fromLabel: "From",
            toLabel: "To",
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            firstDay: 1,
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last Week': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')]
         }
        };

	    //Watch for date changes
	    $scope.$watch('date', function(newDate) {
	    	console.log($scope.date);
	    	$scope.loadData();
	    }, false);
	
	$scope.loadData = function(){
		var data= {
				'from' : $scope.date.startDate.format('YYYYMMDD'),
				'to'   : $scope.date.endDate.format('YYYYMMDD')
		};
		sharedDataService
		.loadData(
				'/services/refund/ARNReport',
				'POST',
				data,
				'reportTableLoader',
				'reportTable',
				function(dataResponse) {
					$scope.rows = [];
					if(dataResponse.status == 'N') return;
					$scope.selectedReport = [];
					$scope.rows = $filter('orderBy')(dataResponse.filenames, 'Date', 'reverse')
					console.log("LOGGING dataresponses");
					console.log(dataResponse);
						});
		}
	$scope.loadData();
	

	$scope.getFileURL = function(fileName){
		return (sharedDataService.getBaseContext() + '/services/refund/downloadARNFile/'+fileName);
		}
	
	$scope.removeSelected = function(){
		var requestList = $scope.prepareReportData();
		console.log(requestList);
		sharedDataService
		.loadData(
				'/services/refund/markARNDownload',
				'POST',
				requestList,
				'reportTableLoader',
				'reportTable',
				function() {
					$scope.selectedReport = [];
					$scope.loadData();
						});	
	}
	
	$scope.prepareReportData = function(){
		var requestList =[];
		for(var i=0; i< $scope.selectedReport.length; ++i){
			var tempObj={
					'mercid':$scope.selectedReport[i].mercid,
					'filename':$scope.selectedReport[i].name
			}
			requestList.push(tempObj);
		}
		return requestList;
	}

}





function bmstidReportController($scope , $filter, sharedDataService){
	$scope.rows=[];
	$scope.selectedReport = [];

	$scope.date = {
	        startDate: moment().subtract("days", 1),
	        endDate: moment()
	    };

	$scope.open = function(){
	    	$("#daterangebox").trigger("click");
	    }
	    
    $scope.minDate = moment().subtract('month', 3).startOf('month');
    $scope.maxDate = moment();
    
    $scope.opts = {
		minDate : $scope.minDate,
		maxDate : $scope.maxDate,
		dateLimit : {days : 1000},
        locale: {
        	format: 'YYYY-MM-DD',
            applyClass: 'btn-green',
            applyLabel: "Apply",
            fromLabel: "From",
            toLabel: "To",
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            firstDay: 1,
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last Week': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')]
         }
        };

	    //Watch for date changes
	    $scope.$watch('date', function(newDate) {
	    	console.log($scope.date);
	    	$scope.loadData();
	    }, false);
	
	$scope.loadData = function(){
		var data= {
				'from' : $scope.date.startDate.format('YYYYMMDD'),
				'to'   : $scope.date.endDate.format('YYYYMMDD')
		};
		sharedDataService
		.loadData(
				'/services/settlement/bmstidReport',
				'POST',
				data,
				'reportTableLoader',
				'reportTable',
				function(dataResponse) {
					if(dataResponse.status == 'N') return;
					$scope.selectedReport = [];
					$scope.rows = $filter('orderBy')(dataResponse.filenames, 'tidDate', 'reverse')
					console.log(dataResponse);
						});
		}
	$scope.loadData();
	

	$scope.getFileURL = function(fileName){
		return (sharedDataService.getBaseContext() + '/services/settlement/downloadbmsTidFile/'+fileName);
		}
	
	$scope.removeSelected = function(){
		var requestList = $scope.prepareReportData();
		console.log(requestList);
		sharedDataService
		.loadData(
				'/services/settlement/markbmsTidDownload',
				'POST',
				requestList,
				'reportTableLoader',
				'reportTable',
				function() {
					$scope.selectedReport = [];
					$scope.loadData();
						});	
	}
	
	$scope.prepareReportData = function(){
		var requestList =[];
		for(var i=0; i< $scope.selectedReport.length; ++i){
			var tempObj={
					'mercid':$scope.selectedReport[i].mercid,
					'filename':$scope.selectedReport[i].name,
					'billeridbms':$scope.selectedReport[i].billeridbms
			}
			requestList.push(tempObj);
		}
		return requestList;
	}

};

function bankQueryController($scope, $http, $modal, $filter, $location, sharedDataService , Pagination , queryFilterService, commonQueryService, User, RenderLogic){
		queryFilterService.clearSelectedFilter();
		queryFilterService.setBackendFilter();

		// Injecting rendr login into scope
		$scope.r = RenderLogic.r;
		
		$scope.commonService = commonQueryService;
		$scope.queryConfig = User.getQueryFeature();
		$scope.isSearching = false;
		$scope.paymentStatus ={};
		$scope.searchPlaceHolder = "";
		$scope.queryFilterService = queryFilterService;
		$scope.tags=['first','second'];
		$scope.pagination = Pagination.getNew(10);
		$scope.Reverse=true;
		$scope.from = from;
		$scope.to = to;
		$scope.searchValue = "";
		$scope.selectedRow="";
		$scope.pagination.rowPerPageOption="";
		$scope.pagination.firstPage="";
		$scope.pagination.lastPage="";
		$scope.pagination.selectRange="";
		$scope.pagination.visibleLimit="";
		$scope.advanceSearch={};
		$scope.advanceSearch.isOpen = false;
		$scope.advanceSearch.creditCardName={};	
		$scope.advanceSearch.creditCardName.param="creditCardName";
		$scope.advanceSearch.creditCardName.value="";
		$scope.advanceSearch.creditCardName.useLike=true;
		$scope.advanceSearch.creditCardName.caseIgnore=true;
		
		$scope.advanceSearch.cardFirstSix={};	
		$scope.advanceSearch.cardFirstSix.param="cardFirstSix";
		$scope.advanceSearch.cardFirstSix.value="";
		$scope.advanceSearch.cardFirstSix.useLike=true;
		$scope.advanceSearch.cardFirstSix.caseIgnore=false;

		$scope.advanceSearch.cardLastFour={};	
		$scope.advanceSearch.cardLastFour.param="cardLastFour";
		$scope.advanceSearch.cardLastFour.value="";
		$scope.advanceSearch.cardLastFour.useLike=true;
		$scope.advanceSearch.cardLastFour.caseIgnore=false;

		$scope.advanceSearch.ipAddress={};	
		$scope.advanceSearch.ipAddress.param="ipAddress";
		$scope.advanceSearch.ipAddress.value="";
		$scope.advanceSearch.ipAddress.useLike=true;
		$scope.advanceSearch.ipAddress.caseIgnore=true;

		$scope.advanceSearch.paramList = [$scope.advanceSearch.ipAddress,$scope.advanceSearch.cardFirstSix,$scope.advanceSearch.cardLastFour,$scope.advanceSearch.creditCardName]

		angular.copy(commonQueryService.paymentStatus,$scope.paymentStatus);
		
		$scope.tempAmount = 1000;

		$scope.formatAmount = function(amount){
			return amount.toFixed(2);
		}
						
		$scope.prepareAdvanceSearchParameter = function(){
			var list = [];
			for (var i=0; i <  $scope.advanceSearch.paramList.length ;++i){
				if($scope.advanceSearch.paramList[i].value != "")
					list.push($scope.advanceSearch.paramList[i])
			}
			return list;
		}
		
		$scope.prepareFilterParameter = function(){
			var filterList= {};
			var minMaxList = [];
			angular.copy(queryFilterService.selected,filterList);
			filterList.merchantIdList=commonQueryService.convertToArrayOfString(filterList.merchantIdList,'actualValue');
			filterList.bankIdList=commonQueryService.convertToArrayOfString(filterList.bankIdList,'actualValue');
			minMaxList.push(filterList.amount.min);
			minMaxList.push(filterList.amount.max);
			filterList.amount = minMaxList;
			return filterList;
		}

		$scope.prepareBlankFilter = function(){
			 var filterList ={};
	         var minMaxList = [];
			 filterList.merchantIdList=[];
			 filterList.bankIdList=[];
			 filterList.paymentCategoryList=[];
			 filterList.networkList=[];
			 filterList.paymentStatusList=[] ;
			 filterList.settlementStatusList=[] ;
			 filterList.uaDeviceCategoryList=[] ;
			 minMaxList.push(NaN);
	         minMaxList.push(NaN);
			 filterList.amount=minMaxList;
		     return filterList;
		}

		$scope.reSort	=	function(column) {
			if ($scope.sortColumn == column)
				$scope.Reverse=!$scope.Reverse;
			else
				$scope.sortColumn=column;
		}

		$scope.loadData = function(searchString, from, to , meBank, advanceSearchParameter ,filterList) {
			$scope.isSearching = true;
			$scope.advanceSearch.hideAdvanceSearchPopover();
			var data = {
					"fromTimestamp":from,
					"toTimestamp":to,
					"meBank":meBank,
					"searchString":searchString,
					"advanceParamList":advanceSearchParameter,
					"filterList":filterList
					};
			console.log(JSON.stringify(data));
			sharedDataService
					.loadData(
							'/services/bank/generalSearch',
							'POST',
							data,
							'refTableLoader',
							'refTable',
							function(dataResponse) {
								if (dataResponse['data'] == null)
									$scope.rows=[];
								else
									{
									$scope.rows=dataResponse['data'];
									}
								var size = dataResponse['size'];
								queryFilterService.searchResult=$scope.rows;
								queryFilterService.currentView=queryFilterService.searchResult;
								console.log($scope.rows);
								$scope.isSearching = false;
								$scope.advanceSearch.dismissAdvanceSearch();
								if(size>500)
									{
										$scope.showLimitExceedWarning();
									}
									});
		};
		
		$scope.setTxnStatusList = function ( filterList){
			if($scope.viewType != commonQueryService.viewType.QUERY){
				filterList.paymentStatusList = [commonQueryService.paymentStatus.SUCCESS];
			}
		}
		
		$scope.getData = function() {
			$scope.initiated = true;
			var	advanceSearchParameter = $scope.prepareAdvanceSearchParameter();
			var filterList= $scope.prepareBlankFilter();
			if(queryFilterService.useBackendFilter)
				{
				filterList=$scope.prepareFilterParameter();
				queryFilterService.resetBackendFilter();
				}
			else
				{
				queryFilterService.clearSelectedFilter();
				}
			$scope.setTxnStatusList(filterList);
			$scope.loadData($scope.searchValue,queryFilterService.dateRange.startDate,queryFilterService.dateRange.endDate,$scope.meBank,advanceSearchParameter,filterList);
			}
		
		
		$scope.populateHeaders = function (header) {
			$scope.merchantDetailHeader=header.MERCHANTDETAIL;
			$scope.paymentDetailHeaderCard=header.PAYMENTDETAIL;
			$scope.paymentDetailHeader= _.cloneDeep(header.PAYMENTDETAIL);
			_.remove($scope.paymentDetailHeader, function(item) {
			  return item.fieldName == 'maskedCardNumber';
			});
			$scope.sourceDetailHeader=header.SOURCEDETAIL;
			$scope.settlementDetailHeader=header.SETTLEMENTDETAIL;
			$scope.searchResultHeader=header.SEARCHRESULT;
			_.remove($scope.searchResultHeader, function(item) {
				return item.fieldName.toLowerCase() == 'ref1';
			});
			$scope.refundDetailHeader=header.REFUNDDETAIL;
			$scope.postingDetailHeader=header.POSTINGDETAIL;
			$scope.authenticationDetailHeader=header.AUTHENTICATIONDETAIL;
			$scope.authenticationRecordDetailHeader=header.AUTHENTICATIONRECORDDETAIL;
		}
		
		$scope.getPaymentDetailHeader = function(isCard){
			if( isCard )
				return $scope.paymentDetailHeaderCard;
			else
				return $scope.paymentDetailHeader;
		}
		
		$scope.resetPagination = function () {
			$scope.pagination.page=0;
			$scope.pagination.numPages = Math.ceil(queryFilterService.currentView.length/$scope.pagination.perPage);
			$scope.pagination.firstPage=0;
			$scope.pagination.selectRange=[];
			var upperLimit = 5;
			$scope.pagination.lastPage=$scope.pagination.numPages-1;
			$scope.pagination.visibleLimit=($scope.pagination.numPages< $scope.pagination.upperLimit ? $scope.pagination.numPages : $scope.pagination.upperLimit);
			$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.firstPage);
			
		}
		
		$scope.pagination.createRangeList = function ( min  ){
			var list = [];
			for(var i= min ; i < min + $scope.pagination.visibleLimit   ;i++) {
				list.push(i);
				}
			return list;
		}
		
		$scope.pagination.goFirst = function () {
			$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.firstPage);
			$scope.pagination.toPageId($scope.pagination.firstPage);
		}

		$scope.pagination.goLast = function () {
			$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.lastPage-$scope.pagination.visibleLimit+1 );
			$scope.pagination.toPageId($scope.pagination.lastPage);
		}
		
		$scope.pagination.goLeft = function () {
			if($scope.pagination.selectRange[0] == $scope.pagination.page)
				{
					$scope.pagination.selectRange.pop();
					$scope.pagination.prevPage();
					$scope.pagination.selectRange.unshift($scope.pagination.page);
				}
			else
				{
					$scope.pagination.prevPage();
				}
		}
		
		$scope.pagination.goRight = function () {
			if($scope.pagination.selectRange[$scope.pagination.visibleLimit-1] == $scope.pagination.page)
				{
					$scope.pagination.selectRange.shift();
					$scope.pagination.nextPage();
					$scope.pagination.selectRange.push($scope.pagination.page);
				}
			else
				{
					$scope.pagination.nextPage();
				}
		}
			
		$scope.selectRow = function(id) {
			if($scope.selectedRow != id){
			//console.log('row selected',$scope.selectedRow,id);
			$scope.selectedRow=id;
		}
			else{	
				//console.log('row Deselected',$scope.selectedRow,id);
				$scope.selectedRow="";
		}
			
			
		}
		
		$scope.isSelected = function(id) {
			//console.log('checking selected',id,$scope.selectedRow);
			if($scope.selectedRow == id ) return true;
			else return false;
		}
		
		

	    $scope.$watch(function () {
	    return queryFilterService.currentView;
	}, 
	      function(newVal, oldVal) {
		//alert('changed');
		$scope.currentView = newVal;
		$scope.resetPagination();
		//console.log(newVal);
	    //console.log(oldVal);
	    }, true);
	    
		$scope.setInitialUserInfo = function(dataResponse ,searchPlaceHolder) {
			$scope.populateHeaders(dataResponse.headerInfo);
			$scope.searchPlaceHolder = searchPlaceHolder;
			$scope.reSort('txnTime');
			$scope.pagination.rowPerPageOption=[10,20,50];
			$scope.pagination.upperLimit=5;
			queryFilterService.user = dataResponse.filterInfo;
			queryFilterService.user.amount={min:NaN,max:NaN};
			queryFilterService.clearResult();
			//console.log(dataResponse);
		}
		
		commonQueryService.getInitialUserInfo($scope.setInitialUserInfo);
			
		$scope.openFilter = function(){
			$modal.open({
			      templateUrl: 'static/partials/Transaction/bankModalFilter.html',
		      controller: 'queryFilterController',
		      size: 'lg',
		      resolve: {
		    	  scopeQuery : function() {return $scope;}
		      }
		      
		    });
		}

		$scope.showLimitExceedWarning = function(){
			$modal.open({
			      templateUrl: 'static/partials/Transaction/limitExceeded.html',
		      controller: 'bankLimitExceedModalController',
		      resolve: {
		    	  viewType: function () {
			          return commonQueryService.viewType.QUERY;
		      },
			scopeQuery : function() {return $scope;}

		      }
		      
		    });
		}
		
		$scope.advanceSearch.toggleAdvanceSearch = function(){
			$scope.advanceSearch.isOpen = !$scope.advanceSearch.isOpen;
			if ($scope.advanceSearch.isOpen)$('#advanceSearch').popover('show');
			else {
				$scope.advanceSearch.dismissAdvanceSearch();
			}
			//console.log('Advance Search');
		}
		
		$scope.advanceSearch.hideAdvanceSearchPopover = function(){
			$scope.advanceSearch.isOpen = false;
			$('#advanceSearch').popover('hide');
		}
		
		$scope.advanceSearch.dismissAdvanceSearch = function(){
			$scope.advanceSearch.hideAdvanceSearchPopover();
			$scope.advanceSearch.ipAddress.value="";
			$scope.advanceSearch.cardFirstSix.value="";
			$scope.advanceSearch.cardLastFour.value="";
			$scope.advanceSearch.creditCardName.value="";
			}
		
		$scope.getAuthenticationDetail = function(row){
			console.log('OTP api call blocked for now!' + row.txnRefNo);
			// $scope.fetchAuthenticationDetail(row);
		}
		
		$scope.fetchAuthenticationDetail = function(row) {
			sharedDataService
					.loadData(
							'/services/bank/getAuthenticationData',
							'POST',
							row.txnRefNo,
							'',
							'',
							function(dataResponse) {
								row.authenticationData = dataResponse;
							});
		}

};

function bankDailyQueryController($scope, $http, $modal, $filter, $location, sharedDataService , Pagination , reportFilterService, commonQueryService, User, RenderLogic){
	reportFilterService.clearSelectedFilter();
	
	// Injecting rendr login into scope
	$scope.r = RenderLogic.r;
	
	$scope.commonService = commonQueryService;
	$scope.queryConfig = User.getQueryFeature();
	$scope.isSearching = false;
	$scope.paymentStatus ={};
	$scope.searchPlaceHolder = "";
	$scope.tags=['first','second'];
	$scope.pagination = Pagination.getNew(10);
	$scope.Reverse=true;
	$scope.from = from;
	$scope.to = to;
	$scope.searchValue = "";
	$scope.selectedRow="";
	$scope.pagination.rowPerPageOption="";
	$scope.pagination.firstPage="";
	$scope.pagination.lastPage="";
	$scope.pagination.selectRange="";
	$scope.pagination.visibleLimit="";
	$scope.advanceSearch={};
	$scope.advanceSearch.isOpen = false;
	$scope.advanceSearch.creditCardName={};	
	$scope.advanceSearch.creditCardName.param="creditCardName";
	$scope.advanceSearch.creditCardName.value="";
	$scope.advanceSearch.creditCardName.useLike=true;
	$scope.advanceSearch.creditCardName.caseIgnore=true;
	
	$scope.advanceSearch.cardFirstSix={};	
	$scope.advanceSearch.cardFirstSix.param="cardFirstSix";
	$scope.advanceSearch.cardFirstSix.value="";
	$scope.advanceSearch.cardFirstSix.useLike=true;
	$scope.advanceSearch.cardFirstSix.caseIgnore=false;
	
	$scope.advanceSearch.cardLastFour={};	
	$scope.advanceSearch.cardLastFour.param="cardLastFour";
	$scope.advanceSearch.cardLastFour.value="";
	$scope.advanceSearch.cardLastFour.useLike=true;
	$scope.advanceSearch.cardLastFour.caseIgnore=false;
	
	$scope.advanceSearch.ipAddress={};	
	$scope.advanceSearch.ipAddress.param="ipAddress";
	$scope.advanceSearch.ipAddress.value="";
	$scope.advanceSearch.ipAddress.useLike=true;
	$scope.advanceSearch.ipAddress.caseIgnore=true;
	
	$scope.advanceSearch.paramList = [$scope.advanceSearch.ipAddress,$scope.advanceSearch.cardFirstSix,$scope.advanceSearch.cardLastFour,$scope.advanceSearch.creditCardName]
	
	$scope.dailyQueryDownload = false;
	
	angular.copy(commonQueryService.paymentStatus,$scope.paymentStatus);
	
	$scope.tempAmount = 1000;
	
	$scope.formatAmount = function(amount){
		return amount.toFixed(2);
	}
	
	$scope.prepareAdvanceSearchParameter = function(){
		var list = [];
		for (var i=0; i <  $scope.advanceSearch.paramList.length ;++i){
			if($scope.advanceSearch.paramList[i].value != "")
				list.push($scope.advanceSearch.paramList[i])
		}
		return list;
	}
	
	$scope.prepareFilterParameter = function(){
		var filterList= {};
		var minMaxList = [];
		angular.copy(reportFilterService.selected,filterList);
		filterList.merchantIdList=commonQueryService.convertToArrayOfString(filterList.merchantIdList,'actualValue');
		filterList.bankIdList=commonQueryService.convertToArrayOfString(filterList.bankIdList,'actualValue');
		minMaxList.push(filterList.amount.min);
		minMaxList.push(filterList.amount.max);
		filterList.amount = minMaxList;
		return filterList;
	}
	
	$scope.prepareBlankFilter = function(){
		var filterList ={};
		var minMaxList = [];
		filterList.merchantIdList=[];
		filterList.bankIdList=[];
		filterList.paymentCategoryList=[];
		filterList.networkList=[];
		filterList.paymentStatusList=[] ;
		filterList.settlementStatusList=[] ;
		filterList.uaDeviceCategoryList=[] ;
		minMaxList.push(NaN);
		minMaxList.push(NaN);
		filterList.amount=minMaxList;
		return filterList;
	}
	
	$scope.reSort	=	function(column) {
		if ($scope.sortColumn == column)
			$scope.Reverse=!$scope.Reverse;
		else
			$scope.sortColumn=column;
	}
	
	$scope.loadData = function(searchString, from, to, meBank, advanceSearchParameter, filterList, pageNo, pageSize) {
		$scope.isSearching = true;
		$scope.advanceSearch.hideAdvanceSearchPopover();
		var data = {
				"fromTimestamp":from,
				"toTimestamp":to,
				"meBank": meBank,
				"searchString":searchString,
				"advanceParamList":advanceSearchParameter,
				"filterList":filterList,
				"pageNo":pageNo,
				"pageSize":pageSize
		};
		console.log(JSON.stringify(data));
		sharedDataService
		.loadData(
				'/services/bank/generalDailySearch',
				'POST',
				data,
				'refTableLoader',
				'refTable',
				function(dataResponse) {
					if (dataResponse['data'] == null) {
						$scope.rows=[];
						$scope.dailyQueryDownload = false;
					}
					else
					{
						$scope.rows=dataResponse['data'];
						if(dataResponse['size'] > -1) {
							$scope.resultCount = dataResponse['size'];
							$scope.resetPagination();
						}
						$scope.dailyQueryDownload = true;
						$scope.isSearching = false;
						$scope.advanceSearch.dismissAdvanceSearch();
						$scope.currentView= $scope.rows;
					}
					console.log($scope.rows);
				});
	};
	
	$scope.retrievePage = function() {
		var	advanceSearchParameter = $scope.prepareAdvanceSearchParameter();
		var filterList= $scope.prepareFilterParameter();
		$scope.loadData($scope.searchValue,reportFilterService.dateRange.startDate,reportFilterService.dateRange.endDate, $scope.meBank,
				advanceSearchParameter,filterList ,$scope.pagination.page, $scope.pagination.perPage );
		}
	
	$scope.getData = function() {
		$scope.initiated = true;
		var	advanceSearchParameter = $scope.prepareAdvanceSearchParameter();
		var filterList= $scope.prepareFilterParameter();
		$scope.loadData($scope.searchValue,reportFilterService.dateRange.startDate,reportFilterService.dateRange.endDate, $scope.meBank,
				advanceSearchParameter,filterList, 0, $scope.pagination.perPage);
	}
	
	
	$scope.populateHeaders = function (header) {
		$scope.merchantDetailHeader=header.MERCHANTDETAIL;
		$scope.paymentDetailHeaderCard=header.PAYMENTDETAIL;
		$scope.paymentDetailHeader= _.cloneDeep(header.PAYMENTDETAIL);
		_.remove($scope.paymentDetailHeader, function(item) {
			return item.fieldName == 'maskedCardNumber';
		});
		$scope.sourceDetailHeader=header.SOURCEDETAIL;
		$scope.settlementDetailHeader=header.SETTLEMENTDETAIL;
		$scope.searchResultHeader=header.SEARCHRESULT;
		_.remove($scope.searchResultHeader, function(item) {
			return item.fieldName.toLowerCase() == 'ref1';
		});
		$scope.refundDetailHeader=header.REFUNDDETAIL;
		$scope.postingDetailHeader=header.POSTINGDETAIL;
		$scope.authenticationDetailHeader=header.AUTHENTICATIONDETAIL;
		$scope.authenticationRecordDetailHeader=header.AUTHENTICATIONRECORDDETAIL;
	}
	
	$scope.getPaymentDetailHeader = function(isCard){
		if( isCard )
			return $scope.paymentDetailHeaderCard;
		else
			return $scope.paymentDetailHeader;
	}
	
	$scope.resetPagination = function () {
		$scope.pagination.page=0;
		$scope.pagination.numPages = Math.ceil($scope.resultCount/$scope.pagination.perPage);
		$scope.pagination.firstPage=0;
		$scope.pagination.selectRange=[];
		var upperLimit = 5;
		$scope.pagination.lastPage=$scope.pagination.numPages-1;
		$scope.pagination.visibleLimit=($scope.pagination.numPages< $scope.pagination.upperLimit ? $scope.pagination.numPages : $scope.pagination.upperLimit);
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.firstPage);
		
	}
	
	$scope.pagination.createRangeList = function ( min  ){
		var list = [];
		for(var i= min ; i < min + $scope.pagination.visibleLimit   ;i++) {
			list.push(i);
		}
		return list;
	}
	
	$scope.pagination.goFirst = function () {
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.firstPage);
		$scope.pagination.page = $scope.pagination.firstPage;
		$scope.retrievePage();
	}

	$scope.pagination.goLast = function () {
		$scope.pagination.selectRange = $scope.pagination.createRangeList($scope.pagination.lastPage-$scope.pagination.visibleLimit+1 );
		$scope.pagination.page = $scope.pagination.lastPage;
		$scope.retrievePage();
	}

	$scope.pagination.toPage = function (pageNo) {
		$scope.pagination.page = pageNo;
		$scope.retrievePage();
	}
	
	$scope.pagination.goLeft = function () {
		if($scope.pagination.selectRange[0] == $scope.pagination.page)
		{
			$scope.pagination.selectRange.pop();
			$scope.pagination.prevPage();
			$scope.pagination.selectRange.unshift($scope.pagination.page);
		}
		else
		{
			$scope.pagination.prevPage();
		}
	}
	
	$scope.pagination.goRight = function () {
		if($scope.pagination.selectRange[$scope.pagination.visibleLimit-1] == $scope.pagination.page)
		{
			$scope.pagination.selectRange.shift();
			$scope.pagination.nextPage();
			$scope.pagination.selectRange.push($scope.pagination.page);
		}
		else
		{
			$scope.pagination.nextPage();
		}
	}
	
	$scope.selectRow = function(id) {
		if($scope.selectedRow != id){
			//console.log('row selected',$scope.selectedRow,id);
			$scope.selectedRow=id;
		}
		else{	
			//console.log('row Deselected',$scope.selectedRow,id);
			$scope.selectedRow="";
		}
		
		
	}
	
	$scope.isSelected = function(id) {
		//console.log('checking selected',id,$scope.selectedRow);
		if($scope.selectedRow == id ) return true;
		else return false;
	}
	
	
	
	$scope.setInitialUserInfo = function(dataResponse ,searchPlaceHolder) {
		$scope.populateHeaders(dataResponse.headerInfo);
		$scope.searchPlaceHolder = searchPlaceHolder;
		$scope.reSort('txnTime');
		$scope.pagination.rowPerPageOption=[10,20,50];
		$scope.pagination.upperLimit=5;
		reportFilterService.user = dataResponse.filterInfo;
		reportFilterService.user.amount={min:NaN,max:NaN};
	}
	
	commonQueryService.getInitialUserInfo($scope.setInitialUserInfo);
	
	$scope.openFilter = function(){
		$modal.open({
			templateUrl: 'static/partials/Transaction/bankModalFilter.html',
			controller: 'reportFilterController',
			size: 'lg',
			resolve: {
				scopeReport : function() {return $scope;}
			}
		
		});
	}
	
	$scope.showLimitExceedWarning = function(){
		$modal.open({
			templateUrl: 'static/partials/Transaction/dailyLimitExceeded.html',
			controller: 'limitExceedModalController',
			resolve: {
				viewType: function () {
					return commonQueryService.viewType.DAILYQUERY;
				},
				scopeQuery : function() {return $scope;}
				
			}
		
		});
	}
	
	$scope.advanceSearch.toggleAdvanceSearch = function(){
		$scope.advanceSearch.isOpen = !$scope.advanceSearch.isOpen;
		if ($scope.advanceSearch.isOpen)$('#advanceSearch').popover('show');
		else {
			$scope.advanceSearch.dismissAdvanceSearch();
		}
		//console.log('Advance Search');
	}
	
	$scope.advanceSearch.hideAdvanceSearchPopover = function(){
		$scope.advanceSearch.isOpen = false;
		$('#advanceSearch').popover('hide');
	}
	
	$scope.advanceSearch.dismissAdvanceSearch = function(){
		$scope.advanceSearch.hideAdvanceSearchPopover();
		$scope.advanceSearch.ipAddress.value="";
		$scope.advanceSearch.cardFirstSix.value="";
		$scope.advanceSearch.cardLastFour.value="";
		$scope.advanceSearch.creditCardName.value="";
	}
	
	$scope.getAuthenticationDetail = function(row){
		console.log('OTP api call blocked now!' + row.txnRefNo);
		// $scope.fetchAuthenticationDetail(row);
	}
	
	$scope.fetchAuthenticationDetail = function(row) {
		sharedDataService
		.loadData(
				'/services/bank/getAuthenticationData',
				'POST',
				row.txnRefNo,
				'',
				'',
				function(dataResponse) {
					row.authenticationData = dataResponse;
				});
	}
	
    $scope.getBankDailyQueryExcelReport = function(fileFormat) {
		if ($scope.resultCount > 100000) {
			var displayInfo ={};
			displayInfo.title = 'Report results exceed the limit(100000)';
			displayInfo.message = 'Please filter your search and regenerate the report.';
			displayInfo.status = 'WARNING';
			displayInfo.resultCount = $scope.resultCount;
			displayInfo.MAXDOWNLOADSIZE = 100000;
			$scope.showReportRequestFeedback(displayInfo);
			return;
		}
		var	advanceSearchParameter = $scope.prepareAdvanceSearchParameter();
		var filterList= $scope.prepareFilterParameter();
		var data = {
				"param" : {
					"fromTimestamp":reportFilterService.dateRange.startDate,
					"toTimestamp":reportFilterService.dateRange.endDate,
					"meBank": $scope.meBank,
					"searchString":$scope.searchValue,
					"advanceParamList":advanceSearchParameter,
					"filterList":filterList,
				},
				"fileFormat": fileFormat,
				"reportType":"PG_BANK_DAILY_QUERY"
		};
		sharedDataService.loadData(
				'/services/bank/general-daily-search/export', 'POST',
				data, '', '', function(
						response) {
					var displayInfo ={};
					if(response.status == 'Request Failed')
						{
						displayInfo.message = 'Something went wrong.Your download request could not be placed..!';
						displayInfo.status = 'ERROR';
						}
					else if(response.status == 'ok'){
						displayInfo.message = 'Report queued for downloading';
						displayInfo.status = response.status;
						}
					else if(response.status == 'WARNING'){
						displayInfo.message = 'You cannot place any more request right now';
						displayInfo.status = response.status;
						}
					$scope.showReportRequestFeedback(displayInfo);
				}
				)
	};

	$scope.showReportRequestFeedback = function(displayInfo){
		$modal.open({
		      templateUrl: 'static/partials/Transaction/bankReportRequestFeedback.html',
	      controller: 'reportRequestFeedbackController',
	      resolve: { displayInfo : function(){return displayInfo;}    
	      }
	    });
	};
	
	$scope.initiateSearch = function(paginationChange) {
		if(paginationChange && $scope.currentView.length == 0)return;
		$scope.initiated = true;
		$scope.pagination.page = 0;
		$scope.retrievePage();
	};
	
};

function bankReportController($scope, $modal, sharedDataService, bankReportService){
	$scope.reportDownload = true;
	$scope.graphData = {};
	$scope.reportData = {};
    $scope.getBankExcelReport = function(){
		var data = {
				"from" : bankReportService.dateRange.startDate,
				"to" : bankReportService.dateRange.endDate
			};

		sharedDataService.loadData(
				'/services/bank/performance/export', 'POST',
				data, '', '', function(
						response) {
					var displayInfo ={};
					if(response.status == 'Request Failed')
						{
						displayInfo.message = 'Something went wrong.Your download request could not be placed..!';
						displayInfo.status = 'ERROR';
						}
					else if(response.status == 'ok'){
						displayInfo.message = 'Report queued for downloading';
						displayInfo.status = response.status;
						}
					else if(response.status == 'WARNING'){
						displayInfo.message = 'You cannot place any more request right now';
						displayInfo.status = response.status;
						}
					$scope.showReportRequestFeedback(displayInfo);
				}
				)
	};

	$scope.showReportRequestFeedback = function(displayInfo){
		$modal.open({
		      templateUrl: 'static/partials/Transaction/bankReportRequestFeedback.html',
	      controller: 'reportRequestFeedbackController',
	      resolve: { displayInfo : function(){return displayInfo;}    
	      }
	    });
	};
	
	$scope.extractArray = function(fieldName){
		var temp= _($scope.reportData).filter(fieldName).pluck(fieldName).value();
		return _.map(temp, function(n) {
			  return parseFloat(n);
			})
	};

    $scope.getResponseSuccessData = function(){
		var data = {
				"from" : bankReportService.dateRange.startDate,
				"to" : bankReportService.dateRange.endDate
		};
	sharedDataService.loadData(
			'/services/bank/performance/responsesuccessdata', 'POST',
			data, 'responseSuccessChartLoader', 'responseSuccessChartContent', function(
					dataResponse) {
				if (dataResponse.status == "ok"){
					$scope.reportData = dataResponse.payload;

					$scope.graphData.xAxis = $scope.extractArray('txndatetime');
					$scope.graphData.responseRatio = $scope.extractArray('responseRatio');
					$scope.graphData.success = $scope.extractArray('success');

					$scope.successTotal = _.sum($scope.graphData.success);
					if ($scope.successTotal !== undefined && $scope.successTotal !== 0){
						$scope.reportDownload = true;
					}
					else{
						$scope.reportDownload = false;
					}

					//Main chart
					responseSuccessBankChart("responseSuccessBankMainChart",$scope.graphData)

				}else{
					$scope.reportDownload = false;
				}
			});
    };
    
	$scope.$on('handleBankReportBroadcast', function() {
		$scope.getResponseSuccessData();
	});
};

function BankReportDateRangePicker($scope, bankReportService){
	$scope.date = {
        startDate: moment().subtract("days", 2),
        endDate: moment()
    };

	$scope.open = function(){
    	$("#daterangebox").trigger("click");
    }
    
    $scope.minDate = moment().subtract('year', 1).startOf('month');
    $scope.maxDate = moment();
    
    $scope.opts = {
		minDate : $scope.minDate,
		maxDate : $scope.maxDate,
		dateLimit : {days : 7},
        locale: {
        	format: 'YYYY-MM-DD',
            applyClass: 'btn-green',
            applyLabel: "Apply",
            fromLabel: "From",
            toLabel: "To",
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            firstDay: 1,
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last Week': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
         }
        };

    //Watch for date changes
    $scope.$watch('date', function(newDate) {
        console.log('New date set: ', newDate);
    	bankReportService.setReportDate(newDate);
    	bankReportService.broadcastItem();
    }, false);

};

function bankReportDownloadTabController($scope, sharedDataService ,$http ,$location, reportFilterService){

	$scope.moment = function(date) {
		return moment(date).unix() * 1000;
	}
	
	$scope.selectedReport = [];
	$scope.header = [
                 {fieldName:"id",fieldHeader:"REQUEST ID"},
                 {fieldName:"requestTime",fieldHeader:"REQUEST TIME"},
                 {fieldName:"reportDesc",fieldHeader:"REPORT TYPE"},
                 {fieldName:"status",fieldHeader:"STATUS"},
                 ]

$scope.rows=[];

$scope.loadData = function() {
	sharedDataService
			.loadData(
					'/services/bank/performance/getReportStatus',
					'GET',
					"",
					'refTableLoader',
					'refTable',
					function(dataResponse) {
						$scope.rows=dataResponse;
					});
}

$scope.removeSelected = function(){
	sharedDataService
	.loadData(
			'/services/bank/performance/removeReport',
			'POST',
			$scope.selectedReport,
			'refTableLoader',
			'refTableLoader',
			function() {
				$scope.selectedReport = [];
				$scope.loadData();
					});	
}

$scope.isComplete = function(reportStatus){
	if(reportStatus == reportFilterService.status.COMPLETE)return true;
	else return false;
}

$scope.getFileURL = function(fileName){
    return (sharedDataService.getBaseContext() + '/services/bank/performance/downloadFile/'+fileName);
}

$scope.isDownloading = function(fileName){
	if( $scope.downloadList.indexOf(fileName) > -1)return true;
	else return false;
}

$scope.loadData();

};


function bankScheduledReportDownloadTabController($scope, sharedDataService ,$http ,$location, reportFilterService){

	$scope.rows=[];

	$scope.loadData = function() {
		sharedDataService.loadData(
			'/services/bank/performance/getScheduledReports',
			'GET',
			"",
			'refTableLoader',
			'refTable',
			function(dataResponse) {
				$scope.rows=dataResponse;
			}
		);
	}

	$scope.getFileURL = function(fileName){
		return (sharedDataService.getBaseContext() + '/services/bank/performance/schedule-reports/download/'+fileName);
	}

	$scope.isDownloading = function(fileName){
		if( $scope.downloadList.indexOf(fileName) > -1) {
			return true;
		}
		else {
			return false;
		}
	}

	$scope.loadData();

};
