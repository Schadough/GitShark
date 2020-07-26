//
//  DirectoryPicker.swift
//  GitShark
//
//  Created by Corbin Crutchley on 6/27/20.
//  Copyright © 2020 OceanBit. All rights reserved.
//

import UIKit
import MobileCoreServices

@objc(DirectoryPicker)
class DirectoryPicker: NSObject, UIDocumentPickerDelegate {
  func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
    print(urls)
  }
  
  func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentAt url: URL) {
  }

  func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {

  }

  @objc
  public func pickFolder() -> Void {
    let documentPicker =
        UIDocumentPickerViewController(documentTypes: [kUTTypeFolder as String],
                                       in: .open)
        documentPicker.delegate = self
    topMostViewController()?.present(documentPicker, animated: true, completion: nil)
  }
   
  @objc
  fileprivate func topMostViewController() -> UIViewController? {
       var ret: UIViewController? = UIApplication.shared.keyWindow?.rootViewController
       repeat {
           if let presented = ret?.presentedViewController {
               ret = presented
           } else {
               break
           }
       } while(true)
       return ret
   }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
